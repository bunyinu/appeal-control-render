#!/usr/bin/env node

if (
  !process.env.BOOTSTRAP_ADMIN_EMAIL
  || !process.env.BOOTSTRAP_ADMIN_PASSWORD
) {
  console.log('Skipping bootstrap admin; bootstrap environment variables are not configured.');
  process.exit(0);
}

require('./bootstrap-admin');
