
const shouldLogSql = process.env.DB_LOG_SQL === 'true';
const sslEnabled = process.env.DB_SSL === 'true';
const sslRejectUnauthorized = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';
const databaseUrl = process.env.DATABASE_URL || '';

const buildConfig = (overrides = {}) => ({
  dialect: 'postgres',
  logging: shouldLogSql ? console.log : false,
  seederStorage: 'sequelize',
  ...(databaseUrl ? { use_env_variable: 'DATABASE_URL' } : {}),
  ...(sslEnabled ? {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: sslRejectUnauthorized,
      },
    },
  } : {}),
  ...overrides,
});

module.exports = {
  production: buildConfig({
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }),
  development: buildConfig({
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'db_appeal_control',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
  }),
  dev_stage: buildConfig({
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
  }),
};
