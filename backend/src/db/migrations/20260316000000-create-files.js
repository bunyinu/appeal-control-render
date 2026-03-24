module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const rows = await queryInterface.sequelize.query(
        "SELECT to_regclass('public.files') AS regclass_name;",
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
        'files',
        {
          id: {
            type: Sequelize.DataTypes.UUID,
            defaultValue: Sequelize.DataTypes.UUIDV4,
            primaryKey: true,
          },
          belongsTo: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
          },
          belongsToId: {
            type: Sequelize.DataTypes.UUID,
            allowNull: true,
          },
          belongsToColumn: {
            type: Sequelize.DataTypes.STRING(255),
            allowNull: true,
          },
          name: {
            type: Sequelize.DataTypes.STRING(2083),
            allowNull: false,
          },
          sizeInBytes: {
            type: Sequelize.DataTypes.INTEGER,
            allowNull: true,
          },
          privateUrl: {
            type: Sequelize.DataTypes.STRING(2083),
            allowNull: true,
          },
          publicUrl: {
            type: Sequelize.DataTypes.STRING(2083),
            allowNull: false,
          },
          createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
          },
          deletedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: true,
          },
          createdById: {
            type: Sequelize.DataTypes.UUID,
            allowNull: true,
            references: {
              key: 'id',
              model: 'users',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          updatedById: {
            type: Sequelize.DataTypes.UUID,
            allowNull: true,
            references: {
              key: 'id',
              model: 'users',
            },
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
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
        "SELECT to_regclass('public.files') AS regclass_name;",
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

      await queryInterface.dropTable('files', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
