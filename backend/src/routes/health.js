const express = require('express');
const db = require('../db/models');

const router = express.Router();

function createHealthPayload(overrides = {}) {
  return {
    status: 'ok',
    service: 'appealcontrol-backend',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || 'dev',
    ...overrides,
  };
}

router.get('/', (req, res) => {
  res.status(200).json(createHealthPayload());
});

router.get('/ready', async (req, res) => {
  try {
    await db.sequelize.authenticate();

    res.status(200).json(
      createHealthPayload({
        database: 'ok',
      }),
    );
  } catch (error) {
    res.status(503).json(
      createHealthPayload({
        status: 'degraded',
        database: 'unavailable',
        error: 'database_unavailable',
      }),
    );
  }
});

module.exports = router;
