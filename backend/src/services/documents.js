const db = require('../db/models');
const DocumentsDBApi = require('../db/api/documents');
const processFile = require("../middlewares/upload");
const ValidationError = require('./notifications/errors/validation');
const csv = require('csv-parser');
const Logger = require('./logger');
const { canAccessOrganization } = require('../helpers/currentUser');

const stream = require('stream');





module.exports = class DocumentsService {
  static async create(data, currentUser) {
    if (data.case || data.caseId) {
      const CasesDBApi = require('../db/api/cases');
      const caseId = data.case || data.caseId;
      const dbCase = await CasesDBApi.findBy({id: caseId});
      if (!dbCase || !canAccessOrganization(currentUser, dbCase.organizationId)) {
         throw new ValidationError('documentsNotFound', 'Case not found or access denied');
      }
      data.case = caseId;
      data.organization = dbCase.organizationId;
    }

    const transaction = await db.sequelize.transaction();
    try {
      const newEntity = await DocumentsDBApi.create(
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      if (newEntity.caseId) { await Logger.log({ organizationId: newEntity.organizationId, caseId: newEntity.caseId, actorUserId: currentUser.id, actionType: 'document_uploaded', message: 'document uploaded' }); }
      return newEntity;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async bulkImport(req, res) {
    const transaction = await db.sequelize.transaction();

    try {
      await processFile(req, res);
      const bufferStream = new stream.PassThrough();
      const results = [];

      await bufferStream.end(Buffer.from(req.file.buffer, "utf-8")); // convert Buffer to Stream

      await new Promise((resolve, reject) => {
        bufferStream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', async () => {
            console.log('CSV results', results);
            resolve();
          })
          .on('error', (error) => reject(error));
      })

      await DocumentsDBApi.bulkImport(results, {
          transaction,
          ignoreDuplicates: true,
          validate: true,
          currentUser: req.currentUser
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async update(data, id, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      let documents = await DocumentsDBApi.findBy(
        {id},
        {transaction},
      );

      if (!documents) {
        throw new ValidationError(
          'documentsNotFound',
        );
      }

      const updatedDocuments = await DocumentsDBApi.update(
        id,
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      let dbEntity = await DocumentsDBApi.findBy({id});
      if (dbEntity && dbEntity.caseId) {
         let act = 'document_updated';
         if (data.status === 'completed' && dbEntity.status !== 'completed') act = 'documents_completed';
         await Logger.log({ organizationId: dbEntity.organizationId, caseId: dbEntity.caseId, actorUserId: currentUser.id, actionType: act, message: act.replace('_', ' ') });
      }
      return updatedDocuments;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteByIds(ids, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await DocumentsDBApi.deleteByIds(ids, {
        currentUser,
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async remove(id, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await DocumentsDBApi.remove(
        id,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  
};
