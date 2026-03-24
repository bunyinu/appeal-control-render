const bcrypt = require('bcrypt');
const db = require('../db/models');
const UsersDBApi = require('../db/api/users');
const ValidationError = require('./notifications/errors/validation');
const ForbiddenError = require('./notifications/errors/forbidden');
const EmailAddressVerificationEmail = require('./email/list/addressVerification');
const InvitationEmail = require('./email/list/invitation');
const PasswordResetEmail = require('./email/list/passwordReset');
const EmailSender = require('./email');
const config = require('../config');
const helpers = require('../helpers');
const Logger = require('./logger');
const { redactSensitiveData } = require('../helpers/security');

class Auth {
  static normalizeEmail(email) {
    return String(email || '').trim().toLowerCase();
  }

  static resolveOrganizationId(user) {
    return (
      user?.organizationId ||
      user?.organizationsId ||
      user?.organization?.id ||
      user?.organizations?.id ||
      null
    );
  }

  static getClientIp(req) {
    const forwardedFor = req?.headers?.['x-forwarded-for'];

    if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
      return forwardedFor.split(',')[0].trim();
    }

    return req?.ip || req?.socket?.remoteAddress || null;
  }

  static async logAuthEvent({
    req,
    user,
    email,
    actionType,
    message,
    action = 'login',
    metadata = {},
  }) {
    await Logger.log({
      organizationId: this.resolveOrganizationId(user),
      actorUserId: user?.id || null,
      entityType: 'user',
      entityKey: user?.id || email || null,
      action,
      actionType,
      message,
      metadata: {
        email,
        ...metadata,
      },
      ipAddress: this.getClientIp(req),
      occurredAt: new Date(),
    });
  }

  static async signup(email, password, organizationId, options = {}, host) {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await UsersDBApi.findBy({ email: normalizedEmail });
    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt.saltRounds,
    );

    if (user) {
      if (user.authenticationUid) {
        throw new ValidationError(
          'auth.emailAlreadyInUse',
        );
      }

      if (user.disabled) {
        throw new ValidationError(
          'auth.userDisabled',
        );
      }

      await UsersDBApi.updatePassword(
        user.id,
        hashedPassword,
        options,
      );

      if (EmailSender.isConfigured) {
        await this.sendEmailAddressVerificationEmail(
          user.email,
          host,
        );
      }

      const data = {
        user: {
          id: user.id,
          email: user.email,
        },
      };

      return helpers.jwtSign(data);
    }

    const newUser = await UsersDBApi.createFromAuth(
      {
        firstName: normalizedEmail.split('@')[0],
        password: hashedPassword,
        email: normalizedEmail,
        organizationId,
      },
      options,
    );

    if (EmailSender.isConfigured) {
      await this.sendEmailAddressVerificationEmail(
        newUser.email,
        host,
      );
    }

    const data = {
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    };

    return helpers.jwtSign(data);
  }

  static async signin(email, password, req) {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await UsersDBApi.findBy({ email: normalizedEmail });

    if (!user) {
      await this.logAuthEvent({
        req,
        email: normalizedEmail,
        actionType: 'auth_login_failed',
        message: 'Login failed for unknown account',
        metadata: { reason: 'user_not_found' },
      });

      throw new ValidationError(
        'auth.userNotFound',
      );
    }

    if (user.disabled) {
      await this.logAuthEvent({
        req,
        user,
        email: normalizedEmail,
        actionType: 'auth_login_failed',
        message: 'Login blocked for disabled account',
        metadata: { reason: 'user_disabled' },
      });

      throw new ValidationError(
        'auth.userDisabled',
      );
    }

    if (!user.password) {
      await this.logAuthEvent({
        req,
        user,
        email: normalizedEmail,
        actionType: 'auth_login_failed',
        message: 'Login failed because no local password is set',
        metadata: { reason: 'missing_local_password' },
      });

      throw new ValidationError(
        'auth.wrongPassword',
      );
    }

    if (!EmailSender.isConfigured) {
      user.emailVerified = true;
    }

    if (!user.emailVerified) {
      await this.logAuthEvent({
        req,
        user,
        email: normalizedEmail,
        actionType: 'auth_login_failed',
        message: 'Login blocked for unverified email address',
        metadata: { reason: 'email_not_verified' },
      });

      throw new ValidationError(
        'auth.userNotVerified',
      );
    }

    const passwordsMatch = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordsMatch) {
      await this.logAuthEvent({
        req,
        user,
        email: normalizedEmail,
        actionType: 'auth_login_failed',
        message: 'Login failed because the password did not match',
        metadata: { reason: 'wrong_password' },
      });

      throw new ValidationError(
        'auth.wrongPassword',
      );
    }

    const data = {
      user: {
        id: user.id,
        email: user.email,
      },
    };

    await this.logAuthEvent({
      req,
      user,
      email: normalizedEmail,
      actionType: 'auth_login_success',
      message: 'User signed in successfully',
    });

    return helpers.jwtSign(data);
  }

  static async sendEmailAddressVerificationEmail(email, host) {
    const normalizedEmail = this.normalizeEmail(email);

    if (!EmailSender.isConfigured) {
      return { skipped: true, reason: 'email_not_configured', email: normalizedEmail };
    }

    let link;
    try {
      const token = await UsersDBApi.generateEmailVerificationToken(
        normalizedEmail,
      );
      link = `${host}/verify-email?token=${token}`;
    } catch (error) {
      console.error('Failed to build email verification link', redactSensitiveData(error));
      throw new ValidationError(
        'auth.emailAddressVerificationEmail.error',
      );
    }

    const emailAddressVerificationEmail = new EmailAddressVerificationEmail(
      normalizedEmail,
      link,
    );

    return new EmailSender(
      emailAddressVerificationEmail,
    ).send();
  }

  static async sendPasswordResetEmail(email, type = 'register', host, req) {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await UsersDBApi.findBy({ email: normalizedEmail });

    if (!EmailSender.isConfigured) {
      await this.logAuthEvent({
        req,
        user,
        email: normalizedEmail,
        action: 'updated',
        actionType: 'auth_password_reset_requested',
        message: 'Password reset requested',
        metadata: { delivery: 'disabled' },
      });

      return { skipped: true, reason: 'email_not_configured', email: normalizedEmail };
    }

    let link;

    try {
      const token = await UsersDBApi.generatePasswordResetToken(
        normalizedEmail,
      );
      link = `${host}/password-reset?token=${token}`;
    } catch (error) {
      console.error('Failed to build password reset link', redactSensitiveData(error));
      throw new ValidationError(
        'auth.passwordReset.error',
      );
    }

    let passwordResetEmail;
    if (type === 'register') {
      passwordResetEmail = new PasswordResetEmail(
        normalizedEmail,
        link,
      );
    }
    if (type === 'invitation') {
      passwordResetEmail = new InvitationEmail(
        normalizedEmail,
        link,
      );
    }

    await this.logAuthEvent({
      req,
      user,
      email: normalizedEmail,
      action: 'updated',
      actionType: 'auth_password_reset_requested',
      message: 'Password reset requested',
      metadata: { delivery: EmailSender.isConfigured ? 'email' : 'disabled' },
    });

    return new EmailSender(passwordResetEmail).send();
  }

  static async verifyEmail(token, options = {}) {
    const user = await UsersDBApi.findByEmailVerificationToken(
      token,
      options,
    );

    if (!user) {
      throw new ValidationError(
        'auth.emailAddressVerificationEmail.invalidToken',
      );
    }

    return UsersDBApi.markEmailVerified(
      user.id,
      options,
    );
  }

  static async passwordUpdate(currentPassword, newPassword, options) {
    const currentUser = options.currentUser || null;
    if (!currentUser) {
      throw new ForbiddenError();
    }

    const currentPasswordMatch = await bcrypt.compare(
      currentPassword,
      currentUser.password,
    );

    if (!currentPasswordMatch) {
      throw new ValidationError(
        'auth.wrongPassword',
      );
    }

    const newPasswordMatch = await bcrypt.compare(
      newPassword,
      currentUser.password,
    );

    if (newPasswordMatch) {
      throw new ValidationError(
        'auth.passwordUpdate.samePassword',
      );
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      config.bcrypt.saltRounds,
    );

    return UsersDBApi.updatePassword(
      currentUser.id,
      hashedPassword,
      options,
    );
  }

  static async passwordReset(token, password, options = {}) {
    const user = await UsersDBApi.findByPasswordResetToken(
      token,
      options,
    );

    if (!user) {
      throw new ValidationError(
        'auth.passwordReset.invalidToken',
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt.saltRounds,
    );

    await UsersDBApi.updatePassword(
      user.id,
      hashedPassword,
      options,
    );

    await this.logAuthEvent({
      req: options,
      user,
      email: user.email,
      action: 'updated',
      actionType: 'auth_password_reset_completed',
      message: 'Password reset completed',
    });

    return true;
  }

  static async updateProfile(data, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await UsersDBApi.findBy(
        { id: currentUser.id },
        { transaction },
      );

      await UsersDBApi.update(
        currentUser.id,
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = Auth;
