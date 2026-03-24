#!/usr/bin/env node

const requiredInProduction = [
  ['APP_URL', 'Frontend public URL is required'],
  ['CORS_ORIGIN', 'CORS_ORIGIN is required'],
];

const failures = [];
const warnings = [];

function hasValue(key) {
  return String(process.env[key] || '').trim().length > 0;
}

if (process.env.NODE_ENV === 'production') {
  for (const [key, message] of requiredInProduction) {
    if (!hasValue(key)) {
      failures.push(`${key}: ${message}`);
    }
  }

  if (!hasValue('BACKEND_PUBLIC_URL') && !hasValue('BACKEND_INTERNAL_HOSTPORT')) {
    failures.push('BACKEND_PUBLIC_URL or BACKEND_INTERNAL_HOSTPORT: backend runtime address is required');
  }

  if (!hasValue('SECRET_KEY') || process.env.SECRET_KEY === 'dev-only-insecure-change-me') {
    failures.push('SECRET_KEY: must be set to a strong non-default value');
  }

  if (process.env.ENABLE_DEMO_SEEDING === 'true') {
    failures.push('ENABLE_DEMO_SEEDING: must be false in production');
  }

  if (process.env.ENABLE_AI_PROXY === 'true') {
    if (!hasValue('AI_PROXY_BASE_URL')) {
      failures.push('AI_PROXY_BASE_URL: required when ENABLE_AI_PROXY=true');
    }

    if (!hasValue('PROJECT_UUID')) {
      failures.push('PROJECT_UUID: required when ENABLE_AI_PROXY=true');
    }
  }

  const emailUser = hasValue('EMAIL_USER');
  const emailPass = hasValue('EMAIL_PASS');
  if (emailUser !== emailPass) {
    failures.push('EMAIL_USER and EMAIL_PASS: both must be set together or both omitted');
  }

  if (!emailUser || !emailPass) {
    warnings.push('Email delivery is not configured; invitation and reset email flows will be disabled');
  }
}

if (failures.length) {
  console.error('Production readiness validation failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

if (warnings.length) {
  console.warn('Production readiness warnings:');
  for (const warning of warnings) {
    console.warn(`- ${warning}`);
  }
}

console.log('Production readiness validation passed.');
