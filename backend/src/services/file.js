const formidable = require('formidable');
const fs = require('fs');
const config = require('../config');
const path = require('path');
const { format } = require("util");
const {
  redactSensitiveData,
  hasAllowedFileExtension,
} = require('../helpers/security');

const privateDownloadHeaders = {
  'Cache-Control': 'private, no-store, max-age=0',
  Pragma: 'no-cache',
  'X-Content-Type-Options': 'nosniff',
};

const sanitizeFilename = (filename) => {
  const normalized = path.basename(String(filename || '').trim());
  return normalized.replace(/[^a-zA-Z0-9._-]/g, '_');
};

const resolveUploadPath = (...segments) => {
  const resolved = path.resolve(...segments);
  const uploadRoot = path.resolve(config.uploadDir);
  const relative = path.relative(uploadRoot, resolved);

  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    return null;
  }

  return resolved;
};

const ensureDirectoryExistence = (filePath) => {
  const dirname = path.dirname(filePath);

  fs.mkdirSync(dirname, { recursive: true });
};

const getFirstValue = (value) => (Array.isArray(value) ? value[0] : value);

const getUploadedFile = (files) => {
  const uploaded = getFirstValue(files?.file);

  if (!uploaded) {
    return null;
  }

  return {
    tempPath: uploaded.filepath || uploaded.path || null,
    mimeType: uploaded.mimetype || uploaded.type || null,
    originalFilename: uploaded.originalFilename || uploaded.name || null,
  };
};

const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

const uploadLocal = (
  folder,
  validations = {
    entity: null,
    maxFileSize: null,
    folderIncludesAuthenticationUid: false,
  },
) => {
  return (req, res) => {
    if (!req.currentUser) {
      res.sendStatus(403);
      return;
    }

    if (
      validations.entity
    ) {
      res.sendStatus(403);
      return;
    }

    let resolvedFolder = folder;

    if (validations.folderIncludesAuthenticationUid) {
      resolvedFolder = resolvedFolder.replace(
        ':userId',
        req.currentUser.authenticationUid,
      );
      if (
        !req.currentUser.authenticationUid ||
        !resolvedFolder.includes(req.currentUser.authenticationUid)
      ) {
        res.sendStatus(403);
        return;
      }
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = config.uploadDir;
    form.multiples = false;
    form.maxFiles = 1;

    if (validations && validations.maxFileSize) {
      form.maxFileSize = validations.maxFileSize;
    }

    form.parse(req, function (err, fields, files) {
      if (err) {
        console.error('Local upload parse failed', redactSensitiveData(err));
        return res.status(400).send('File upload failed');
      }

      const uploadedFile = getUploadedFile(files);
      const requestedFilename = getFirstValue(fields?.filename) || uploadedFile?.originalFilename;
      const filename = sanitizeFilename(requestedFilename);
      const fileTempUrl = uploadedFile?.tempPath;
      const fileMimeType = uploadedFile?.mimeType;

      if (!fileTempUrl) {
        return res.status(400).send('File upload is required');
      }

      if (!filename) {
        safeUnlink(fileTempUrl);
        return res.status(400).send('Filename is required');
      }

      if (
        !config.upload.allowedMimeTypes.includes(fileMimeType) ||
        !hasAllowedFileExtension(filename, config.upload.allowedExtensions)
      ) {
        safeUnlink(fileTempUrl);
        return res.status(400).send('Unsupported file type');
      }

      const privateUrl = resolveUploadPath(
        form.uploadDir,
        resolvedFolder,
        filename,
      );
      if (!privateUrl) {
        safeUnlink(fileTempUrl);
        return res.status(400).send('Invalid file path');
      }
      ensureDirectoryExistence(privateUrl);
      fs.renameSync(fileTempUrl, privateUrl);
      res.set(privateDownloadHeaders);
      res.sendStatus(200);
    });

    form.on('error', function (err) {
      console.error('Local upload error', redactSensitiveData(err));
      res.status(400).send('File upload failed');
    });
  }
};

const downloadLocal = async (req, res) => {
    const privateUrl = req.query.privateUrl;
    if (!privateUrl) {
      return res.sendStatus(404);
    }
    const resolvedPath = resolveUploadPath(config.uploadDir, privateUrl);
    if (!resolvedPath || !fs.existsSync(resolvedPath)) {
      return res.sendStatus(404);
    }
    res.set(privateDownloadHeaders);
    res.download(resolvedPath, path.basename(resolvedPath));
};

const initGCloud = () => {
  const processFile = require("../middlewares/upload");
  const { Storage } = require("@google-cloud/storage");
  const hash = config.gcloud.hash

  const privateKey = process.env.GC_PRIVATE_KEY.replace(/\\\n/g, "\n");

  const storage = new Storage({
      projectId: process.env.GC_PROJECT_ID,
      credentials: {
          client_email: process.env.GC_CLIENT_EMAIL,
          private_key: privateKey
      }
  });

  const bucket = storage.bucket(config.gcloud.bucket);
  return {hash, bucket, processFile};
}

const uploadGCloud = async (folder, req, res) => {
  try {
    const {hash, bucket, processFile} = initGCloud();
    await processFile(req, res);
    let buffer = await req.file.buffer;
    let filename = sanitizeFilename(await req.body.filename || req.file.originalname);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    if (
      !config.upload.allowedMimeTypes.includes(req.file.mimetype) ||
      !hasAllowedFileExtension(filename, config.upload.allowedExtensions)
    ) {
      return res.status(400).send({ message: 'Unsupported file type' });
    }

    let storagePath = `${hash}/${folder}/${filename}`;
    let blob = bucket.file(storagePath);

    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      console.error('Cloud upload error', redactSensitiveData(err));
      res.status(500).send({ message: 'Could not upload the file.' });
    });

    blobStream.on("finish", async () => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      res.set(privateDownloadHeaders);
      res.status(200).send({
        message: "Uploaded the file successfully: " + storagePath,
        url: publicUrl,
      });
    });

    blobStream.end(buffer)
  } catch (err) {
    console.error('Cloud upload failed', redactSensitiveData(err));

    res.status(500).send({
      message: 'Could not upload the file.'
    });
  }
};

const downloadGCloud = async (req, res) => {
  try {
    const {hash, bucket} = initGCloud();

    const privateUrl = await req.query.privateUrl;
    const filePath = `${hash}/${privateUrl}`;
    const file = bucket.file(filePath)
    const fileExists = await file.exists();

    if (fileExists[0]) {
      res.set(privateDownloadHeaders);
      const stream = file.createReadStream();
      stream.pipe(res);
    }
    else {
      res.status(404).send({
        message: "Could not download the file.",
      });      
    }
  } catch (err) {
    console.error('Cloud download failed', redactSensitiveData(err));
    res.status(404).send({
      message: "Could not download the file.",
    });
  }
};

const deleteGCloud = async (privateUrl) => {
  try {
    const {hash, bucket} = initGCloud();
    const filePath = `${hash}/${privateUrl}`;

    const file = bucket.file(filePath)
    const fileExists = await file.exists();

    if (fileExists[0]) {
      file.delete();
    }
  } catch (err) {
    console.error('Cloud delete failed', {
      privateUrl,
      error: redactSensitiveData(err),
    });
  }
};

module.exports = {
  initGCloud,
  uploadLocal,
  downloadLocal,
  deleteGCloud,
  uploadGCloud,
  downloadGCloud
}
