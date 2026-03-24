const validator = require('validator');
const config = require('../config');

function badRequest(message) {
  const error = new Error(message);
  error.code = 400;
  return error;
}

function assertEmail(email) {
  if (typeof email !== 'string' || !validator.isEmail(email.trim())) {
    throw badRequest('A valid email address is required.');
  }
}

function assertPassword(password, { strong = false, fieldName = 'password' } = {}) {
  if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
    throw badRequest(`A valid ${fieldName} is required.`);
  }

  if (!strong) {
    return;
  }

  if (password.length < config.security.passwordMinLength) {
    throw badRequest(`Passwords must be at least ${config.security.passwordMinLength} characters.`);
  }

  const strongEnough =
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /\d/.test(password);

  if (!strongEnough) {
    throw badRequest('Passwords must include uppercase, lowercase, and numeric characters.');
  }
}

function validateSignIn(req, res, next) {
  try {
    assertEmail(req.body?.email);
    assertPassword(req.body?.password);
    req.body.email = req.body.email.trim().toLowerCase();
    next();
  } catch (error) {
    next(error);
  }
}

function validateSignUp(req, res, next) {
  try {
    assertEmail(req.body?.email);
    assertPassword(req.body?.password, { strong: true });

    if (req.body?.organizationId && !validator.isUUID(String(req.body.organizationId))) {
      throw badRequest('Organization ID must be a valid UUID.');
    }

    req.body.email = req.body.email.trim().toLowerCase();
    next();
  } catch (error) {
    next(error);
  }
}

function validatePasswordResetRequest(req, res, next) {
  try {
    assertEmail(req.body?.email);
    req.body.email = req.body.email.trim().toLowerCase();
    next();
  } catch (error) {
    next(error);
  }
}

function validatePasswordReset(req, res, next) {
  try {
    if (typeof req.body?.token !== 'string' || req.body.token.length < 20) {
      throw badRequest('A valid reset token is required.');
    }

    assertPassword(req.body?.password, { strong: true });
    next();
  } catch (error) {
    next(error);
  }
}

function validatePasswordUpdate(req, res, next) {
  try {
    assertPassword(req.body?.currentPassword, { fieldName: 'current password' });
    assertPassword(req.body?.newPassword, { strong: true, fieldName: 'new password' });
    next();
  } catch (error) {
    next(error);
  }
}

function validateVerifyEmail(req, res, next) {
  try {
    if (typeof req.body?.token !== 'string' || req.body.token.length < 20) {
      throw badRequest('A valid verification token is required.');
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateSignIn,
  validateSignUp,
  validatePasswordResetRequest,
  validatePasswordReset,
  validatePasswordUpdate,
  validateVerifyEmail,
};
