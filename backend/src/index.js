
const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const crypto = require('crypto');
const config = require('./config');
require('./bootstrap/console').installProductionConsoleGuards();
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const createRateLimit = require('./middlewares/rate-limit');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');
const healthRoutes = require('./routes/health');
const searchRoutes = require('./routes/search');
const sqlRoutes = require('./routes/sql');

const organizationForAuthRoutes = require('./routes/organizationLogin');

const openaiRoutes = require('./routes/openai');



const usersRoutes = require('./routes/users');

const rolesRoutes = require('./routes/roles');

const permissionsRoutes = require('./routes/permissions');

const organizationsRoutes = require('./routes/organizations');

const payersRoutes = require('./routes/payers');

const casesRoutes = require('./routes/cases');

const tasksRoutes = require('./routes/tasks');

const documentsRoutes = require('./routes/documents');

const appeal_draftsRoutes = require('./routes/appeal_drafts');

const notesRoutes = require('./routes/notes');

const activity_logsRoutes = require('./routes/activity_logs');

const settingsRoutes = require('./routes/settings');


const getBaseUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/api') ? url.slice(0, -4) : url;
};

const options = {
  definition: {
    openapi: "3.0.0",
      info: {
        version: "1.0.0",
        title: "Appeal Control",
        description: "Appeal Control Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.",
      },
    servers: [
      {
        url: getBaseUrl(process.env.NEXT_PUBLIC_BACK_API) || config.swaggerUrl,
        description: "Development server",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      },
      responses: {
        UnauthorizedError: {
          description: "Access token is missing or invalid"
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsDoc(options);
if (config.features.enableSwagger) {
  app.use('/api-docs', function (req, res, next) {
      swaggerUI.host = getBaseUrl(process.env.NEXT_PUBLIC_BACK_API) || req.get('host');
      next()
    }, swaggerUI.serve, swaggerUI.setup(specs))
}

config.assertRuntimeConfig();
app.enable('trust proxy');
app.disable('x-powered-by');
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || crypto.randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});
app.use(cors({
  origin(origin, callback) {
    if (!origin || config.security.allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const error = new Error('Origin not allowed by CORS policy');
    error.code = 403;
    return callback(error);
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Requested-With', 'X-Request-Id'],
  maxAge: 86400,
}));
require('./auth/auth');

app.use(passport.initialize());
app.use(bodyParser.json({ limit: config.security.maxBodySize }));
app.use(bodyParser.urlencoded({ extended: true, limit: config.security.maxBodySize }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);
if (config.features.enablePexelsProxy) {
  const pexelsRoutes = require('./routes/pexels');
  app.use('/api/pexels', createRateLimit({
    windowMs: config.security.authRateLimitWindowMs,
    max: 30,
    keyPrefix: 'pexels',
  }), pexelsRoutes);
}


app.use('/api/users', passport.authenticate('jwt', {session: false}), usersRoutes);

app.use('/api/roles', passport.authenticate('jwt', {session: false}), rolesRoutes);

app.use('/api/permissions', passport.authenticate('jwt', {session: false}), permissionsRoutes);

app.use('/api/organizations', passport.authenticate('jwt', {session: false}), organizationsRoutes);

app.use('/api/payers', passport.authenticate('jwt', {session: false}), payersRoutes);

app.use('/api/cases', passport.authenticate('jwt', {session: false}), casesRoutes);

app.use('/api/tasks', passport.authenticate('jwt', {session: false}), tasksRoutes);

app.use('/api/documents', passport.authenticate('jwt', {session: false}), documentsRoutes);

app.use('/api/appeal_drafts', passport.authenticate('jwt', {session: false}), appeal_draftsRoutes);

app.use('/api/notes', passport.authenticate('jwt', {session: false}), notesRoutes);

app.use('/api/activity_logs', passport.authenticate('jwt', {session: false}), activity_logsRoutes);

app.use('/api/settings', passport.authenticate('jwt', {session: false}), settingsRoutes);

if (config.features.enableAiProxy) {
  app.use(
      '/api/openai',
      passport.authenticate('jwt', { session: false }),
      createRateLimit({
        windowMs: config.security.aiRateLimitWindowMs,
        max: config.security.aiRateLimitMax,
        keyPrefix: 'openai',
        keyGenerator: (req) => req.currentUser?.id || req.ip,
      }),
      openaiRoutes,
  );
  app.use(
      '/api/ai',
      passport.authenticate('jwt', { session: false }),
      createRateLimit({
        windowMs: config.security.aiRateLimitWindowMs,
        max: config.security.aiRateLimitMax,
        keyPrefix: 'ai',
        keyGenerator: (req) => req.currentUser?.id || req.ip,
      }),
      openaiRoutes,
  );
}

app.use(
  '/api/search',
  passport.authenticate('jwt', { session: false }),
  searchRoutes);
if (config.features.enableSqlConsole) {
  app.use(
    '/api/sql',
    passport.authenticate('jwt', { session: false }),
    sqlRoutes);
}

app.use(
  '/api/org-for-auth',
  organizationForAuthRoutes,
  );

  
const publicDir = path.join(
  __dirname,
  '../public',
);

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function(request, response) {
    response.sendFile(
      path.resolve(publicDir, 'index.html'),
    );
  });
}

const defaultPort = process.env.NODE_ENV === 'dev_stage' ? 3000 : 9000;
const PORT = Number(process.env.PORT) || defaultPort;

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });

module.exports = app;
