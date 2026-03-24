module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const rows = await queryInterface.sequelize.query(
        "SELECT to_regclass('public.\"usersCustom_permissionsPermissions\"') AS regclass_name;",
        {
          transaction,
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const tableName = rows[0].regclass_name;

      if (tableName) {
        await transaction.commit();
        return;
      }

      await queryInterface.createTable(
        'usersCustom_permissionsPermissions',
        {
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          users_custom_permissionsId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
          },
          permissionId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
          },
        },
        { transaction },
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const rows = await queryInterface.sequelize.query(
        "SELECT to_regclass('public.\"usersCustom_permissionsPermissions\"') AS regclass_name;",
        {
          transaction,
          type: Sequelize.QueryTypes.SELECT,
        },
      );
      const tableName = rows[0].regclass_name;

      if (!tableName) {
        await transaction.commit();
        return;
      }

      await queryInterface.dropTable('usersCustom_permissionsPermissions', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
