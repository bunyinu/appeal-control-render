const util = require('util');
const path = require('path');
const Multer = require('multer');
const config = require('../config');
const { hasAllowedFileExtension } = require('../helpers/security');
const maxSize = config.upload.maxFileSize;

let processFile = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
  fileFilter(req, file, callback) {
    const originalName = path.basename(String(file.originalname || '').trim());

    if (
      !config.upload.allowedMimeTypes.includes(file.mimetype) ||
      !hasAllowedFileExtension(originalName, config.upload.allowedExtensions)
    ) {
      return callback(new Error('Unsupported file type'));
    }

    return callback(null, true);
  },
}).single("file");

let processFileMiddleware = util.promisify(processFile);
module.exports = processFileMiddleware;
