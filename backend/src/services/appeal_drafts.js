const db = require('../db/models');
const Appeal_draftsDBApi = require('../db/api/appeal_drafts');
const ValidationError = require('./notifications/errors/validation');
const { Logger } = require('./logger');
const { canAccessOrganization, isAdminUser } = require('../helpers/currentUser');

class Appeal_draftsService {
  static async create(data, currentUser) {
    const caseId = data.caseId || data.case;

    if (!caseId) {
       throw new ValidationError('caseIdRequired', 'Case ID is required');
    }
    
    // Auth: current user org must match case org
    const cases = await db.cases.findByPk(caseId);
    if (!cases || !canAccessOrganization(currentUser, cases.organizationId)) {
       throw new ValidationError('accessDenied', 'Cannot create draft for this case');
    }

    // Versioning
    const maxVersionDraft = await db.appeal_drafts.findOne({
      where: { caseId },
      order: [['version', 'DESC']]
    });
    
    data.version = (maxVersionDraft ? maxVersionDraft.version : 0) + 1;
    data.case = caseId;
    data.organization = cases.organizationId;
    data.status = data.status || 'draft';

    const transaction = await db.sequelize.transaction();

    try {
      const draft = await Appeal_draftsDBApi.create(
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      await Logger.log(currentUser, 'appeal_drafts', draft.id, 'Draft created', { version: data.version });
      return draft;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(data, id, currentUser) {
    const draft = await db.appeal_drafts.findByPk(id);
    if (!draft) {
      throw new ValidationError('draftNotFound', 'Draft not found');
    }

    if (draft.status === 'submitted') {
      throw new ValidationError('draftIsReadOnly', 'Submitted drafts are read-only');
    }

    const isSubmitting = data.status === 'submitted';
    
    if (isSubmitting) {
       // Role check: Only case owner or admin can submit appeal
       const cases = await db.cases.findByPk(draft.caseId);
       const isAdmin = isAdminUser(currentUser);
       const isOwner = cases.owner_userId === currentUser.id;

       if (!isOwner && !isAdmin) {
          throw new ValidationError('accessDenied', 'Only the case owner or an administrator can submit an appeal');
       }

       // Only one draft can be submitted per case
       const existingSubmitted = await db.appeal_drafts.findOne({
         where: { caseId: draft.caseId, status: 'submitted' }
       });

       if (existingSubmitted) {
         throw new ValidationError('alreadySubmitted', 'Another draft is already submitted for this case');
       }

       data.submitted_at = new Date();
       data.submittedByUserId = currentUser.id;

       // Sync case status
       const CasesService = require('./cases');
       await CasesService.update({ status: 'submitted', submitted_at: data.submitted_at }, draft.caseId, currentUser);
    }

    await db.appeal_drafts.update(data, { where: { id } });
    return await db.appeal_drafts.findByPk(id);
  }

  static async deleteByIds(ids) {
    for (const id of ids) {
      const draft = await db.appeal_drafts.findByPk(id);
      if (draft && draft.status === 'submitted') {
        throw new ValidationError('cannotDeleteSubmittedDraft', 'Cannot delete submitted drafts');
      }
    }
    return await db.appeal_drafts.destroy({ where: { id: ids } });
  }

  static async remove(id) {
    return this.deleteByIds([id]);
  }
}

module.exports = Appeal_draftsService;
