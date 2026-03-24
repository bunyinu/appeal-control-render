module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('activity_logs', 'actionType', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('activity_logs', 'metadata', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    
    await queryInterface.addColumn('appeal_drafts', 'version', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
    });
    await queryInterface.addColumn('appeal_drafts', 'summary', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('appeal_drafts', 'body', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('appeal_drafts', 'evidenceChecklist', {
      type: Sequelize.JSONB,
      allowNull: true,
    });
    await queryInterface.addColumn('appeal_drafts', 'submittedByUserId', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    try {
      await queryInterface.sequelize.query('ALTER TABLE appeal_drafts ALTER COLUMN status TYPE VARCHAR(255) USING status::VARCHAR;');
      await queryInterface.sequelize.query('ALTER TABLE cases ALTER COLUMN status TYPE VARCHAR(255) USING status::VARCHAR;');
    } catch(e) {
      console.log(e);
    }
  },
  down: async () => {
  }
};
