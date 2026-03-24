#!/usr/bin/env node

const db = require('../src/db/models');
const coreRolesSeeder = require('../src/db/seeders/20200430130760-user-roles');

async function run() {
  const queryInterface = db.sequelize.getQueryInterface();
  const [existingRoles] = await db.sequelize.query(
    `SELECT id FROM "roles" WHERE name = 'Super Administrator' LIMIT 1;`,
  );

  if (existingRoles.length) {
    console.log('Core access control already seeded.');
    return;
  }

  await coreRolesSeeder.up(queryInterface);
  console.log('Core access control seeded.');
}

run()
  .catch((error) => {
    console.error(error.message || String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.sequelize.close();
  });
