module.exports = {
  up: async (queryInterface) => {
    // Cases indexes
    await queryInterface.addIndex('cases', ['organizationId']);
    await queryInterface.addIndex('cases', ['status']);
    await queryInterface.addIndex('cases', ['owner_userId']);
    await queryInterface.addIndex('cases', ['due_at']);
    await queryInterface.addIndex('cases', ['submitted_at']);
    await queryInterface.addIndex('cases', ['createdAt']);
    
    // Composite indexes for org-scoped case filtering
    await queryInterface.addIndex('cases', ['organizationId', 'status']);
    await queryInterface.addIndex('cases', ['organizationId', 'owner_userId']);
    await queryInterface.addIndex('cases', ['organizationId', 'createdAt']);

    // Relational indexes (caseId) on other tables
    await queryInterface.addIndex('activity_logs', ['caseId']);
    await queryInterface.addIndex('appeal_drafts', ['caseId']);
    await queryInterface.addIndex('documents', ['caseId']);
    await queryInterface.addIndex('notes', ['caseId']);
    await queryInterface.addIndex('tasks', ['caseId']);
    
    // Org filtering on other tables
    await queryInterface.addIndex('activity_logs', ['organizationId']);
    await queryInterface.addIndex('appeal_drafts', ['organizationId']);
    await queryInterface.addIndex('documents', ['organizationId']);
    await queryInterface.addIndex('notes', ['organizationId']);
    await queryInterface.addIndex('tasks', ['organizationId']);
  },
  down: async () => {
    // No-op for safety, or we could remove indexes
  }
};
