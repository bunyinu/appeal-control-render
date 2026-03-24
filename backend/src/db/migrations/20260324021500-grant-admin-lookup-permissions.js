module.exports = {
  async up(queryInterface) {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name = 'Administrator' LIMIT 1;`,
    );
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id, name FROM permissions WHERE name IN ('READ_ROLES', 'READ_PERMISSIONS', 'READ_ORGANIZATIONS');`,
    );

    if (!roles.length || !permissions.length) {
      return;
    }

    const administratorRoleId = roles[0].id;
    const permissionIds = permissions.map((permission) => permission.id);
    const [existingRelations] = await queryInterface.sequelize.query(
      `SELECT "permissionId" FROM "rolesPermissionsPermissions" WHERE "roles_permissionsId" = :roleId AND "permissionId" IN (:permissionIds);`,
      {
        replacements: {
          roleId: administratorRoleId,
          permissionIds,
        },
      },
    );

    const existingPermissionIds = new Set(
      existingRelations.map((relation) => relation.permissionId),
    );
    const timestamp = new Date();
    const missingRelations = permissions
      .filter((permission) => !existingPermissionIds.has(permission.id))
      .map((permission) => ({
        createdAt: timestamp,
        updatedAt: timestamp,
        roles_permissionsId: administratorRoleId,
        permissionId: permission.id,
      }));

    if (missingRelations.length) {
      await queryInterface.bulkInsert(
        'rolesPermissionsPermissions',
        missingRelations,
      );
    }
  },

  async down(queryInterface, Sequelize) {
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id, name FROM roles WHERE name = 'Administrator' LIMIT 1;`,
    );
    const [permissions] = await queryInterface.sequelize.query(
      `SELECT id, name FROM permissions WHERE name IN ('READ_ROLES', 'READ_PERMISSIONS', 'READ_ORGANIZATIONS');`,
    );

    if (!roles.length || !permissions.length) {
      return;
    }

    await queryInterface.bulkDelete(
      'rolesPermissionsPermissions',
      {
        roles_permissionsId: roles[0].id,
        permissionId: {
          [Sequelize.Op.in]: permissions.map((permission) => permission.id),
        },
      },
      {},
    );
  },
};
