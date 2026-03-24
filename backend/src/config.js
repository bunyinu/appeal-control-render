const os = require('os');
const { URL } = require('url');

const isProduction = process.env.NODE_ENV === 'production';
const defaultBackendPort = process.env.NODE_ENV === 'dev_stage' ? '3000' : '9000';
const defaultFrontendPort = process.env.FRONT_PORT || '3000';
const defaultSecretKey = 'dev-only-insecure-change-me';

function normalizeBaseUrl(value) {
  if (!value) {
    return '';
  }

  const trimmed = String(value).trim();

  try {
    const parsed = new URL(trimmed);
    return `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, '').replace(/\/api$/, '');
  } catch (error) {
    return trimmed.replace(/\/+$/, '').replace(/\/api$/, '');
  }
}

function parseCsv(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(',')
    .map((entry) => normalizeBaseUrl(entry))
    .filter(Boolean);
}

const backendPort = String(process.env.PORT || defaultBackendPort);
const frontendPort = String(process.env.FRONT_PORT || defaultFrontendPort);
const explicitFrontendUrl = normalizeBaseUrl(
  process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL,
);
const explicitBackendUrl = normalizeBaseUrl(
  process.env.BACKEND_PUBLIC_URL || process.env.NEXT_PUBLIC_BACK_API,
);
const internalBackendHostport = String(process.env.BACKEND_INTERNAL_HOSTPORT || '').trim();
const internalBackendUrl = internalBackendHostport
  ? normalizeBaseUrl(`http://${internalBackendHostport}`)
  : '';
const localBackendUrl = normalizeBaseUrl(`http://localhost:${backendPort}`);
const localFrontendUrl = normalizeBaseUrl(`http://localhost:${frontendPort}`);
const frontendUrl = explicitFrontendUrl || localFrontendUrl;
const backendUrl = explicitBackendUrl || internalBackendUrl || localBackendUrl;
const allowedOrigins = Array.from(
  new Set(
    [
      ...parseCsv(process.env.CORS_ORIGIN),
      frontendUrl,
      !isProduction ? localFrontendUrl : '',
      !isProduction ? normalizeBaseUrl(`http://127.0.0.1:${frontendPort}`) : '',
    ].filter(Boolean),
  ),
);

const config = {
  isProduction,
  gcloud: {
    bucket: process.env.GC_BUCKET || 'fldemo-files',
    hash: process.env.GC_HASH || 'afeefb9d49f5b7977577876b99532ac7',
  },
  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 12),
  },
  admin_pass: process.env.SEED_ADMIN_PASSWORD || 'fcb45e0e',
  user_pass: process.env.SEED_USER_PASSWORD || 'd0b1868750e0',
  admin_email: process.env.SEED_ADMIN_EMAIL || 'admin@flatlogic.com',
  providers: {
    LOCAL: 'local',
    GOOGLE: 'google',
    MICROSOFT: 'microsoft',
  },
  secret_key: process.env.SECRET_KEY || (!isProduction ? defaultSecretKey : ''),
  remote: backendUrl,
  port: backendPort,
  hostUI: frontendUrl,
  portUI: frontendPort,
  portUIProd: isProduction ? '' : `:${frontendPort}`,
  swaggerUI: backendUrl,
  swaggerPort: isProduction ? '' : `:${backendPort}`,
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  microsoft: {
    clientId: process.env.MS_CLIENT_ID || '',
    clientSecret: process.env.MS_CLIENT_SECRET || '',
  },
  uploadDir: os.tmpdir(),
  upload: {
    maxFileSize: Number(process.env.UPLOAD_MAX_FILE_SIZE || 10 * 1024 * 1024),
    allowedMimeTypes: parseCsv(
      process.env.UPLOAD_ALLOWED_MIME_TYPES ||
      [
        'application/pdf',
        'text/plain',
        'text/csv',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ].join(','),
    ),
    allowedExtensions: parseCsv(
      process.env.UPLOAD_ALLOWED_EXTENSIONS ||
      ['.pdf', '.txt', '.csv', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.doc', '.docx'].join(','),
    ),
  },
  security: {
    allowedOrigins,
    maxBodySize: process.env.MAX_BODY_SIZE || '1mb',
    passwordMinLength: Number(process.env.PASSWORD_MIN_LENGTH || 12),
    authRateLimitWindowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
    authRateLimitMax: Number(process.env.AUTH_RATE_LIMIT_MAX || 10),
    passwordResetRateLimitMax: Number(process.env.PASSWORD_RESET_RATE_LIMIT_MAX || 5),
    aiRateLimitWindowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS || 60 * 1000),
    aiRateLimitMax: Number(process.env.AI_RATE_LIMIT_MAX || 30),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '6h',
    jwtIssuer: process.env.JWT_ISSUER || 'appeal-control',
    jwtAudience: process.env.JWT_AUDIENCE || 'appeal-control-users',
  },
  features: {
    enableSwagger: process.env.ENABLE_SWAGGER === 'true' || !isProduction,
    enableSqlConsole: process.env.ENABLE_SQL_CONSOLE === 'true' && !isProduction,
    enablePexelsProxy: process.env.ENABLE_PEXELS_PROXY === 'true' && !!process.env.PEXELS_KEY,
    enableAiProxy: process.env.ENABLE_AI_PROXY === 'true'
      && !!process.env.AI_PROXY_BASE_URL
      && !!process.env.PROJECT_UUID,
  },
  email: {
    from: process.env.EMAIL_FROM || 'Appeal Control <no-reply@local.invalid>',
    host: process.env.EMAIL_HOST || 'email-smtp.us-east-1.amazonaws.com',
    port: Number(process.env.EMAIL_PORT || 587),
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED !== 'false',
    },
    configurationSet: process.env.EMAIL_CONFIGURATION_SET || '',
  },
  roles: {
    super_admin: 'Super Administrator',
    admin: 'Administrator',
    user: 'Appeals Specialist',
  },
  project_uuid: 'fcb45e0e-41ea-472d-9b77-d0b1868750e0',
  flHost: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'dev_stage'
    ? 'https://flatlogic.com/projects'
    : 'http://localhost:3000/projects',
  gpt_key: process.env.GPT_KEY || '',
  internalBackendHostport,
};

config.pexelsKey = process.env.PEXELS_KEY || '';
config.pexelsQuery = 'Team navigating mountain trail';
config.host = backendUrl;
config.frontendUrl = frontendUrl;
config.backendUrl = backendUrl;
config.apiUrl = `${backendUrl}/api`;
config.swaggerUrl = backendUrl;
config.uiUrl = frontendUrl;
config.backUrl = frontendUrl;

config.assertRuntimeConfig = () => {
  if (!isProduction) {
    return;
  }

  const missing = [];

  if (!config.secret_key || config.secret_key === defaultSecretKey) {
    missing.push('SECRET_KEY');
  }

  if (!explicitFrontendUrl) {
    missing.push('APP_URL or NEXT_PUBLIC_APP_URL');
  }

  if (!explicitBackendUrl && !internalBackendHostport) {
    missing.push('BACKEND_PUBLIC_URL, NEXT_PUBLIC_BACK_API, or BACKEND_INTERNAL_HOSTPORT');
  }

  if (!process.env.CORS_ORIGIN) {
    missing.push('CORS_ORIGIN');
  }

  if (missing.length) {
    throw new Error(`Missing secure production configuration: ${missing.join(', ')}`);
  }
};

module.exports = config;
