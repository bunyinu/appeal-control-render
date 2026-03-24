const express = require('express');
const config = require('../config');
const passport = require('passport');
const services = require('../services/file');
const db = require('../db/models');
const router = express.Router();

function hasSafeRouteSegment(value) {
  return /^[a-zA-Z0-9_-]+$/.test(String(value || ''));
}

function hasSafePrivateUrl(value) {
  const normalized = String(value || '').trim();

  if (!normalized || normalized.startsWith('/') || normalized.includes('..')) {
    return false;
  }

  return normalized.split('/').every((segment) => /^[a-zA-Z0-9._-]+$/.test(segment));
}

function isTemporaryUploadPath(privateUrl) {
  return /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/[0-9a-f-]+\.[a-z0-9]+$/i.test(String(privateUrl || ''));
}

async function fileBelongsToAccessibleRecord(privateUrl, currentUser) {
  if (currentUser?.app_role?.globalAccess) {
    return true;
  }

  const fileRecord = await db.file.findOne({
    where: { privateUrl },
  });

  if (!fileRecord) {
    return isTemporaryUploadPath(privateUrl);
  }

  const relatedModel = db[fileRecord.belongsTo];

  if (!relatedModel || typeof relatedModel.findByPk !== 'function') {
    return false;
  }

  const relatedRecord = await relatedModel.findByPk(fileRecord.belongsToId);

  if (!relatedRecord) {
    return false;
  }

  const recordOrganizationId =
    relatedRecord.organizationId ||
    relatedRecord.organizationsId ||
    null;

  if (!recordOrganizationId) {
    return false;
  }

  return (
    recordOrganizationId === currentUser?.organizationId ||
    recordOrganizationId === currentUser?.organizationsId
  );
}

router.get('/download', passport.authenticate('jwt', {session: false}), async (req, res) => {
  if (!hasSafePrivateUrl(req.query.privateUrl)) {
    return res.status(400).send('Invalid file path');
  }

  const canAccessFile = await fileBelongsToAccessibleRecord(
    req.query.privateUrl,
    req.currentUser,
  );

  if (!canAccessFile) {
    return res.status(403).send('Forbidden');
  }

  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (process.env.NODE_ENV == "production" || process.env.NEXT_PUBLIC_BACK_API) {
    services.downloadGCloud(req, res);
  }
  else {
    services.downloadLocal(req, res);
  }
});

router.post('/upload/:table/:field', passport.authenticate('jwt', {session: false}), (req, res) => {
  if (!hasSafeRouteSegment(req.params.table) || !hasSafeRouteSegment(req.params.field)) {
    return res.status(400).send('Invalid upload target');
  }

  const fileName = `${req.params.table}/${req.params.field}`;

  if (process.env.NODE_ENV == "production" || process.env.NEXT_PUBLIC_BACK_API) {
    services.uploadGCloud(fileName, req, res);
  }
  else {
    services.uploadLocal(fileName, {
      entity: null,
      maxFileSize: config.upload.maxFileSize,
      folderIncludesAuthenticationUid: false,
    })(req, res);
  }
});

module.exports = router;
