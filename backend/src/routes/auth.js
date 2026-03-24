const express = require('express');
const passport = require('passport');

const config = require('../config');
const AuthService = require('../services/auth');
const ForbiddenError = require('../services/notifications/errors/forbidden');
const EmailSender = require('../services/email');
const wrapAsync = require('../helpers').wrapAsync;
const createRateLimit = require('../middlewares/rate-limit');
const {
  validateSignIn,
  validateSignUp,
  validatePasswordResetRequest,
  validatePasswordReset,
  validatePasswordUpdate,
  validateVerifyEmail,
} = require('../middlewares/validate-auth');

const router = express.Router();
const authLimiter = createRateLimit({
  windowMs: config.security.authRateLimitWindowMs,
  max: config.security.authRateLimitMax,
  keyPrefix: 'auth',
});
const passwordResetLimiter = createRateLimit({
  windowMs: config.security.authRateLimitWindowMs,
  max: config.security.passwordResetRateLimitMax,
  keyPrefix: 'auth-password-reset',
});

router.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  next();
});

/**
 *  @swagger
 *  components:
 *    schemas:
 *      Auth:
 *        type: object
 *        required:
 *          - email
 *          - password
 *        properties:
 *          email:
 *            type: string
 *            description: User email for this deployment
 *          password:
 *            type: string
 *            description: User password
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authorization operations
 */

/**
 * @swagger
 *  /api/auth/signin/local:
 *    post:
 *      tags: [Auth]
 *      summary: Logs user into the system
 *      description: Logs user into the system
 *      requestBody:
 *        description: Set valid user email and password
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Auth"
 *      responses:
 *        200:
 *          description: Successful login
 *        400:
 *          description: Invalid username/password supplied
 *      x-codegen-request-body-name: body
 */

router.post('/signin/local', authLimiter, validateSignIn, wrapAsync(async (req, res) => {
  const payload = await AuthService.signin(req.body.email, req.body.password, req,);
  res.status(200).send(payload);
}));

/**
 * @swagger
 *  /api/auth/me:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags: [Auth]
 *      summary: Get current authorized user info
 *      description: Get current authorized user info
 *      responses:
 *        200:
 *          description: Successful retrieval of current authorized user data
 *        400:
 *          description: Invalid username/password supplied
 *      x-codegen-request-body-name: body
 */

router.get('/me', passport.authenticate('jwt', {session: false}), (req, res) => {
  if (!req.currentUser || !req.currentUser.id) {
    throw new ForbiddenError();
  }

  const payload = req.currentUser.get
    ? req.currentUser.get({ plain: true })
    : { ...req.currentUser };
  delete payload.password;
  res.status(200).send(payload);
});

router.put('/password-reset', passwordResetLimiter, validatePasswordReset, wrapAsync(async (req, res) => {
  const payload = await AuthService.passwordReset(req.body.token, req.body.password, req,);
  res.status(200).send(payload);
}));

router.put('/password-update', passport.authenticate('jwt', {session: false}), validatePasswordUpdate, wrapAsync(async (req, res) => {
  const payload = await AuthService.passwordUpdate(req.body.currentPassword, req.body.newPassword, req);
  res.status(200).send(payload);
}));

router.post('/send-email-address-verification-email', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
  if (!req.currentUser) {
    throw new ForbiddenError();
  }

  await AuthService.sendEmailAddressVerificationEmail(req.currentUser.email, config.frontendUrl);
  const payload = true;
  res.status(200).send(payload);
}));

router.post('/send-password-reset-email', passwordResetLimiter, validatePasswordResetRequest, wrapAsync(async (req, res) => {
  await AuthService.sendPasswordResetEmail(req.body.email, 'register', config.frontendUrl, req);
  const payload = true;
  res.status(200).send(payload);
}));

/**
 * @swagger
 *  /api/auth/signup:
 *    post:
 *      tags: [Auth]
 *      summary: Register new user into the system
 *      description: Register new user into the system
 *      requestBody:
 *        description: Set valid user email and password
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Auth"
 *      responses:
 *        200:
 *          description: New user successfully signed up
 *        400:
 *          description: Invalid username/password supplied
 *        500:
 *          description: Some server error
 *      x-codegen-request-body-name: body
 */

router.post('/signup', authLimiter, validateSignUp, wrapAsync(async (req, res) => {
  const payload = await AuthService.signup(
      req.body.email,
      req.body.password,
      req.body.organizationId,
      req,
      config.frontendUrl,
    )
  res.status(200).send(payload);
}));

router.put('/profile', passport.authenticate('jwt', {session: false}), wrapAsync(async (req, res) => {
  if (!req.currentUser || !req.currentUser.id) {
    throw new ForbiddenError();
  }

  await AuthService.updateProfile(req.body.profile, req.currentUser);
  const payload = true;
  res.status(200).send(payload);
}));

router.put('/verify-email', validateVerifyEmail, wrapAsync(async (req, res) => {
  const payload = await AuthService.verifyEmail(req.body.token, req, req.headers.referer)
  res.status(200).send(payload);
}));

router.get('/email-configured', (req, res) => {
  const payload = EmailSender.isConfigured;
  res.status(200).send(payload);
});

function isGoogleConfigured() {
  return Boolean(config.google.clientId && config.google.clientSecret);
}

function isMicrosoftConfigured() {
  return Boolean(config.microsoft.clientId && config.microsoft.clientSecret);
}

function handleMissingOAuthProvider(res, providerLabel) {
  return res.status(404).send(`${providerLabel} sign-in is not configured for this deployment`);
}

router.get('/signin/google', (req, res, next) => {
  if (!isGoogleConfigured()) {
    return handleMissingOAuthProvider(res, 'Google');
  }

  passport.authenticate("google", {scope: ["profile", "email"], state: req.query.app})(req, res, next);
});

router.get('/signin/google/callback', (req, res, next) => {
  if (!isGoogleConfigured()) {
    return handleMissingOAuthProvider(res, 'Google');
  }

  return passport.authenticate("google", {failureRedirect: "/login", session: false})(req, res, next);
},

  function (req, res) {
    socialRedirect(res, req.query.state, req.user.token, config);
  }
);

router.get('/signin/microsoft', (req, res, next) => {
  if (!isMicrosoftConfigured()) {
    return handleMissingOAuthProvider(res, 'Microsoft');
  }

  passport.authenticate("microsoft", {
    scope: ["https://graph.microsoft.com/user.read openid"],
    state: req.query.app
  })(req, res, next);
});

router.get('/signin/microsoft/callback', (req, res, next) => {
    if (!isMicrosoftConfigured()) {
      return handleMissingOAuthProvider(res, 'Microsoft');
    }

    return passport.authenticate("microsoft", {
      failureRedirect: "/login",
      session: false
    })(req, res, next);
  },
  function (req, res) {
    socialRedirect(res, req.query.state, req.user.token, config);
  }
);

router.use('/', require('../helpers').commonErrorHandler);

function socialRedirect(res, state, token, config) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.redirect(`${config.frontendUrl}/login?token=${encodeURIComponent(token)}`);
}

module.exports = router;
