const db = require('../db/models');
const NotesDBApi = require('../db/api/notes');
const CasesDBApi = require('../db/api/cases');
const processFile = require("../middlewares/upload");
const ValidationError = require('./notifications/errors/validation');
const csv = require('csv-parser');
const Logger = require('./logger');
const { canAccessOrganization } = require('../helpers/currentUser');

const stream = require('stream');





module.exports = class NotesService {
  static async create(data, currentUser) {
    if (data.case || data.caseId) {
      const caseId = data.case || data.caseId;
      const dbCase = await CasesDBApi.findBy({ id: caseId });

      if (!dbCase || !canAccessOrganization(currentUser, dbCase.organizationId)) {
        throw new ValidationError('notesNotFound', 'Case not found or access denied');
      }

      data.case = caseId;
      data.organization = dbCase.organizationId;
    }

    const transaction = await db.sequelize.transaction();
    try {
      const newEntity = await NotesDBApi.create(
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      if (newEntity.caseId) { await Logger.log({ organizationId: newEntity.organizationId, caseId: newEntity.caseId, actorUserId: currentUser.id, actionType: 'note_added', message: 'note added' }); }
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

      await NotesDBApi.bulkImport(results, {
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
      let notes = await NotesDBApi.findBy(
        {id},
        {transaction},
      );

      if (!notes) {
        throw new ValidationError(
          'notesNotFound',
        );
      }

      const updatedNotes = await NotesDBApi.update(
        id,
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      let dbEntity = await NotesDBApi.findBy({id});
      if (dbEntity && dbEntity.caseId) {
         let act = 'note_updated';
         if (data.status === 'completed' && dbEntity.status !== 'completed') act = 'notes_completed';
         await Logger.log({ organizationId: dbEntity.organizationId, caseId: dbEntity.caseId, actorUserId: currentUser.id, actionType: act, message: act.replace('_', ' ') });
      }
      return updatedNotes;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteByIds(ids, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await NotesDBApi.deleteByIds(ids, {
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
      await NotesDBApi.remove(
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
