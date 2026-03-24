const config = require('../config');
const providers = config.providers;
const helpers = require('../helpers');
const db = require('../db/models');

const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const MicrosoftStrategy = require('passport-microsoft').Strategy;
const UsersDBApi = require('../db/api/users');
const { redactSensitiveData } = require('../helpers/security');
const hasGoogleOAuth = Boolean(config.google.clientId && config.google.clientSecret);
const hasMicrosoftOAuth = Boolean(
  config.microsoft.clientId && config.microsoft.clientSecret,
);

passport.use(new JWTstrategy({
  passReqToCallback: true,
  secretOrKey: config.secret_key,
  issuer: config.security.jwtIssuer,
  audience: config.security.jwtAudience,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
}, async (req, token, done) => {
  try {
    const tokenUser = token?.user || {};
    const lookup = tokenUser.id
      ? { id: tokenUser.id }
      : tokenUser.email
        ? { email: String(tokenUser.email).trim().toLowerCase() }
        : null;

    if (!lookup) {
      return done(null, false);
    }

    const user = await UsersDBApi.findBy(lookup);

    if (user && user.disabled) {
      return done(null, false);
    }

    if (!user) {
      return done(null, false);
    }

    req.currentUser = user;

    return done(null, user);
  } catch (error) {
    console.error('JWT authentication failed', redactSensitiveData(error));
    done(error);
  }
}));

if (hasGoogleOAuth) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.apiUrl + '/auth/signin/google/callback',
      passReqToCallback: true
    },
    function (request, accessToken, refreshToken, profile, done) {
      socialStrategy(profile.email, profile, providers.GOOGLE, done);
    }
  ));
}


if (hasMicrosoftOAuth) {
  passport.use(new MicrosoftStrategy({
      clientID: config.microsoft.clientId,
      clientSecret: config.microsoft.clientSecret,
      callbackURL: config.apiUrl + '/auth/signin/microsoft/callback',
      passReqToCallback: true
    },
    function (request, accessToken, refreshToken, profile, done) {
      const email = profile._json.mail || profile._json.userPrincipalName;
      socialStrategy(email, profile, providers.MICROSOFT, done);
    }
  ));
}

function socialStrategy(email, profile, provider, done) {
  const normalizedEmail = String(email || '').trim().toLowerCase();

  db.users.findOrCreate({where: {email: normalizedEmail, provider}}).then(([user]) => {
    const body = {
      id: user.id,
      email: user.email,
      name: profile.displayName,
    };
    const token = helpers.jwtSign({user: body});
    return done(null, {token});
  });
}
