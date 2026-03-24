const fs = require('fs');

let code = fs.readFileSync('backend/src/services/appeal_drafts.js', 'utf8');

if (!code.includes("const Logger = require('./logger');")) {
  code = code.replace("const config = require('../config');", "const config = require('../config');\nconst Logger = require('./logger');\n");
}

const createLogic = `
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      if (data.caseId) {
        // Find max version
        const maxVersionDraft = await db.appeal_drafts.findOne({
          where: { caseId: data.caseId },
          order: [['version', 'DESC']],
          transaction
        });
        data.version = maxVersionDraft ? maxVersionDraft.version + 1 : 1;
        data.status = 'draft';
      }

      const newDraft = await Appeal_draftsDBApi.create(data, { currentUser, transaction });
      await transaction.commit();

      if (newDraft.caseId) {
        await Logger.log({
          organizationId: newDraft.organizationId,
          caseId: newDraft.caseId,
          actorUserId: currentUser.id,
          actionType: 'appeal_draft_created',
          message:  'Appeal draft v' + newDraft.version + ' created' 
        });
      }
      return newDraft;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
`;

const updateLogic = `
  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let draft = await Appeal_draftsDBApi.findBy({id}, {transaction});
      if (!draft) throw new ValidationError('appeal_draftsNotFound');
      if (draft.status === 'submitted') {
        throw new ValidationError('draftIsReadOnly', 'Submitted drafts are read-only');
      }

      const isSubmitting = data.status === 'submitted' && draft.status !== 'submitted';
      
      if (isSubmitting) {
        // Only one draft can be submitted per case
        const existingSubmitted = await db.appeal_drafts.findOne({
          where: { caseId: draft.caseId, status: 'submitted' },
          transaction
        });
        if (existingSubmitted) {
            // Can choose to throw error or just un-submit the other. Instructions: "only one draft can be in submitted status per case at a time"
            // Let's un-submit the other one or throw error. Throwing error is safer.
            throw new ValidationError('alreadySubmitted', 'Another draft is already submitted for this case');
        }
        data.submitted_at = new Date();
        data.submittedByUserId = currentUser.id;
      }

      const updatedDraft = await Appeal_draftsDBApi.update(id, data, { currentUser, transaction });

      if (isSubmitting && draft.caseId) {
        // Update case status to submitted
        await db.cases.update({ status: 'submitted' }, { where: { id: draft.caseId }, transaction });
      }

      await transaction.commit();

      if (isSubmitting && draft.caseId) {
         await Logger.log({
          organizationId: draft.organizationId,
          caseId: draft.caseId,
          actorUserId: currentUser.id,
          actionType: 'appeal_submitted',
          message:  'Appeal draft v' + draft.version + ' was submitted' 
        });
      } else if (draft.caseId) {
         await Logger.log({
          organizationId: draft.organizationId,
          caseId: draft.caseId,
          actorUserId: currentUser.id,
          actionType: 'appeal_draft_updated',
          message:  'Appeal draft v' + draft.version + ' was updated' 
        });
      }

      return updatedDraft;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
`;

code = code.replace(/static async create\([\s\S]*?catch \(error\) \{[\s\S]*?throw error;\n    \}\n  \};/m, createLogic);
code = code.replace(/static async update\([\s\S]*?catch \(error\) \{[\s\S]*?throw error;\n    \}\n  \};/m, updateLogic);

fs.writeFileSync('backend/src/services/appeal_drafts.js', code);
