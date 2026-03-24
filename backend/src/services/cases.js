const db = require('../db/models');
const CasesDBApi = require('../db/api/cases');
const processFile = require("../middlewares/upload");
const ValidationError = require('./notifications/errors/validation');
const { Logger } = require('./logger');
const {
  canAccessOrganization,
  isAdminUser,
  resolveOrganizationIdForWrite,
} = require('../helpers/currentUser');
const csv = require('csv-parser');
const stream = require('stream');

class CasesService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      const organizationId = resolveOrganizationIdForWrite(data, currentUser);

      if (!organizationId) {
        throw new ValidationError(
          'organizationRequired',
          'Organization is required to create a case',
        );
      }

      const newEntity = await CasesDBApi.create(
        {
          ...data,
          organization: organizationId,
        },
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      await Logger.log({
        organizationId: newEntity.organizationId,
        caseId: newEntity.id,
        actorUserId: currentUser.id,
        entityType: 'case',
        entityKey: newEntity.case_number || newEntity.id,
        actionType: 'case_created',
        message: 'case created',
      });

      return newEntity;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(data, id, currentUser) {
    const cases = await db.cases.findByPk(id);

    if (!cases) {
      throw new ValidationError('casesNotFound', 'Case not found');
    }

    if (!canAccessOrganization(currentUser, cases.organizationId)) {
      throw new ValidationError('accessDenied', 'Access denied');
    }

    // Role check: Only case owner or admin can change status
    const isAdmin = isAdminUser(currentUser);
    const isOwner = cases.owner_userId === currentUser.id;
    
    if (data.status && data.status !== cases.status) {
      if (!isOwner && !isAdmin) {
         throw new ValidationError('accessDenied', 'Only the case owner or an administrator can change the case status');
      }
      
      // Persist timestamps based on status
      if (data.status === 'submitted') {
        data.submitted_at = new Date();
      } else if (['won', 'lost'].includes(data.status)) {
        data.closed_at = new Date();
      }
      
      await Logger.log(currentUser, 'cases', id, `Status changed from ${cases.status} to ${data.status}`, {
        from: cases.status,
        to: data.status,
        reason: data.statusReason || ''
      });
    }

    if (data.owner_userId && data.owner_userId !== cases.owner_userId) {
       await Logger.log(currentUser, 'cases', id, `Owner changed`, {
         from: cases.owner_userId,
         to: data.owner_userId
       });
    }

    return await CasesDBApi.update(
      id,
      {
        ...data,
        organization: data.organization ?? cases.organizationId,
      },
      {
        currentUser,
      },
    );
  }

  static async assignOwner(id, ownerUserId, currentUser) {
    return this.update({ owner_userId: ownerUserId }, id, currentUser);
  }

  static async changeStatus(id, status, statusReason, currentUser) {
    return this.update({ status, statusReason }, id, currentUser);
  }

  static async submitAppeal(id, currentUser) {
    return this.update({ status: 'submitted' }, id, currentUser);
  }

  static async markWon(id, reason, currentUser) {
    return this.update({ status: 'won', statusReason: reason }, id, currentUser);
  }

  static async markLost(id, reason, currentUser) {
    return this.update({ status: 'lost', statusReason: reason }, id, currentUser);
  }

  static async reopen(id, reason, currentUser) {
    const cases = await db.cases.findByPk(id);
    if (!['won', 'lost', 'submitted'].includes(cases.status)) {
       throw new ValidationError('invalidReopen', 'Only submitted or closed cases can be reopened');
    }
    return this.update({ status: 'intake', statusReason: reason, closed_at: null }, id, currentUser);
  }

  static async remove(id, currentUser) {
    const cases = await db.cases.findByPk(id);
    if (!cases) {
      throw new ValidationError('casesNotFound', 'Case not found');
    }
    if (!canAccessOrganization(currentUser, cases.organizationId)) {
      throw new ValidationError('accessDenied', 'Access denied');
    }
    return await CasesDBApi.remove(id, { currentUser });
  }

  static async bulkImport(req, res) {
    const transaction = await db.sequelize.transaction();

    try {
      await processFile(req, res);
      const bufferStream = new stream.PassThrough();
      const results = [];

      await bufferStream.end(Buffer.from(req.file.buffer, 'utf-8'));

      await new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on('data', (row) => results.push(row))
          .on('end', resolve)
          .on('error', reject);
      });

      await CasesDBApi.bulkImport(results, {
        transaction,
        ignoreDuplicates: true,
        validate: true,
        currentUser: req.currentUser,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteByIds(ids, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await CasesDBApi.deleteByIds(ids, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = CasesService;
