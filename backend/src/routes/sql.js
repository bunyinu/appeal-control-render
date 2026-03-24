const express = require('express');
const db = require('../db/models');
const wrapAsync = require('../helpers').wrapAsync;

const router = express.Router();

/**
 * @swagger
 * /api/sql:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    summary: Execute a SELECT-only SQL query
 *    description: Executes a read-only SQL query and returns rows.
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              sql:
 *                type: string
 *            required:
 *              - sql
 *    responses:
 *      200:
 *        description: Query result
 *      400:
 *        description: Invalid SQL
 *      401:
 *        $ref: "#/components/responses/UnauthorizedError"
 *      500:
 *        description: Internal server error
 */
router.post(
  '/',
  wrapAsync(async (req, res) => {
    if (!req.currentUser?.app_role?.globalAccess) {
      return res.status(403).json({ error: 'SQL console is restricted to global administrators' });
    }

    const { sql } = req.body;
    if (typeof sql !== 'string' || !sql.trim()) {
      return res.status(400).json({ error: 'SQL is required' });
    }

    const normalized = sql.trim().replace(/;+\s*$/, '');
    if (!/^select\b/i.test(normalized)) {
      return res.status(400).json({ error: 'Only SELECT statements are allowed' });
    }

    if (normalized.includes(';')) {
      return res.status(400).json({ error: 'Only a single SELECT statement is allowed' });
    }

    const rows = await db.sequelize.query(normalized, {
      type: db.Sequelize.QueryTypes.SELECT,
    });

    return res.status(200).json({ rows });
  }),
);

module.exports = router;
