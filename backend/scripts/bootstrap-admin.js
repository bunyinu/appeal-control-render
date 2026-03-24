#!/usr/bin/env node

const bcrypt = require('bcrypt');
const db = require('../src/db/models');
const config = require('../src/config');

async function run() {
  const email = String(process.env.BOOTSTRAP_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = String(process.env.BOOTSTRAP_ADMIN_PASSWORD || '').trim();
  const firstName = String(process.env.BOOTSTRAP_ADMIN_FIRST_NAME || 'Platform').trim();
  const lastName = String(process.env.BOOTSTRAP_ADMIN_LAST_NAME || 'Administrator').trim();
  const orgName = String(process.env.BOOTSTRAP_ADMIN_ORG_NAME || 'Primary Organization').trim();
  const roleName = String(
    process.env.BOOTSTRAP_ADMIN_ROLE
      || config.roles.super_admin
      || 'Super Administrator',
  ).trim();

  if (!email || !password) {
    throw new Error('BOOTSTRAP_ADMIN_EMAIL and BOOTSTRAP_ADMIN_PASSWORD are required');
  }

  const transaction = await db.sequelize.transaction();

  try {
    const [organization] = await db.organizations.findOrCreate({
      where: { name: orgName },
      defaults: {
        name: orgName,
      },
      transaction,
    });

    const role = await db.roles.findOne({
      where: { name: roleName },
      transaction,
    });

    if (!role) {
      throw new Error(`Role "${roleName}" was not found. Run migrations and core role seeding first.`);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt.saltRounds,
    );

    const [user, created] = await db.users.findOrCreate({
      where: { email },
      defaults: {
        firstName,
        lastName,
        email,
        emailVerified: true,
        provider: config.providers.LOCAL,
        password: hashedPassword,
        disabled: false,
        organizationsId: organization.id,
        app_roleId: role.id,
      },
      transaction,
    });

    if (!created) {
      await user.update({
        firstName,
        lastName,
        password: hashedPassword,
        emailVerified: true,
        disabled: false,
        organizationsId: organization.id,
        app_roleId: role.id,
      }, { transaction });
    }

    await transaction.commit();

    console.log(
      JSON.stringify(
        {
          email,
          organization: organization.name,
          role: role.name,
          created,
        },
        null,
        2,
      ),
    );
  } catch (error) {
    await transaction.rollback();
    throw error;
  } finally {
    await db.sequelize.close();
  }
}

run().catch((error) => {
  console.error(error.message || String(error));
  process.exit(1);
});
