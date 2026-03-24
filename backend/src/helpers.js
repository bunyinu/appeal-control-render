const jwt = require('jsonwebtoken');
const config = require('./config');
const { redactSensitiveData } = require('./helpers/security');

module.exports = class Helpers {
  static wrapAsync(fn) {
    return function (req, res, next) {
      fn(req, res, next).catch(next);
    };
  }

  static commonErrorHandler(error, req, res, next) {
    void next;
    if ([400, 403, 404, 429].includes(error.code)) {
      return res.status(error.code).send(error.message);
    }

    console.error('Unhandled request error', {
      requestId: req?.requestId || null,
      method: req?.method || null,
      path: req?.originalUrl || null,
      error: redactSensitiveData(error),
    });
    return res
      .status(500)
      .send(config.isProduction ? 'Internal server error' : error.message);
  }

  static jwtSign(data, options = {}) {
    return jwt.sign(data, config.secret_key, {
      expiresIn: config.security.jwtExpiresIn,
      issuer: config.security.jwtIssuer,
      audience: config.security.jwtAudience,
      ...options,
    });
  }
};
