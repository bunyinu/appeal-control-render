const path = require('path');

const REDACTED_VALUE = '[REDACTED]';
const MASKED_SETTING_VALUE = '********';

const SENSITIVE_KEY_PATTERNS = [
  /pass(word)?/i,
  /token/i,
  /secret/i,
  /api[-_]?key/i,
  /authorization/i,
  /cookie/i,
  /session/i,
  /credential/i,
  /private[-_]?key/i,
  /refresh/i,
  /access[-_]?key/i,
];

const EMAIL_KEY_PATTERNS = [/email/i];

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function maskEmail(value) {
  const normalized = String(value || '').trim();
  const atIndex = normalized.indexOf('@');

  if (atIndex <= 1) {
    return REDACTED_VALUE;
  }

  const local = normalized.slice(0, atIndex);
  const domain = normalized.slice(atIndex + 1);

  if (!domain) {
    return REDACTED_VALUE;
  }

  return `${local[0]}***@${domain}`;
}

function shouldRedactKey(key) {
  return SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(String(key || '')));
}

function shouldMaskEmailKey(key) {
  return EMAIL_KEY_PATTERNS.some((pattern) => pattern.test(String(key || '')));
}

function redactSensitiveData(value, keyHint = '') {
  if (value === null || value === undefined) {
    return value;
  }

  if (shouldRedactKey(keyHint)) {
    return REDACTED_VALUE;
  }

  if (typeof value === 'string') {
    return shouldMaskEmailKey(keyHint) ? maskEmail(value) : value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item, keyHint));
  }

  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      code: value.code,
      status: value.status,
    };
  }

  if (isPlainObject(value)) {
    return Object.entries(value).reduce((accumulator, [key, nestedValue]) => {
      accumulator[key] = redactSensitiveData(nestedValue, key);
      return accumulator;
    }, {});
  }

  return value;
}

function maskSensitiveSettingValue() {
  return MASKED_SETTING_VALUE;
}

function isMaskedSensitiveSettingValue(value) {
  return String(value || '').trim() === MASKED_SETTING_VALUE;
}

function hasAllowedFileExtension(filename, allowedExtensions = []) {
  const extension = path.extname(String(filename || '').trim()).toLowerCase();

  if (!extension) {
    return false;
  }

  return allowedExtensions
    .map((item) => String(item || '').trim().toLowerCase())
    .filter(Boolean)
    .includes(extension);
}

module.exports = {
  REDACTED_VALUE,
  MASKED_SETTING_VALUE,
  redactSensitiveData,
  maskSensitiveSettingValue,
  isMaskedSensitiveSettingValue,
  hasAllowedFileExtension,
};
