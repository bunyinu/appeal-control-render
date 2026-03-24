const db = require('../db/models');
const PayersDBApi = require('../db/api/payers');
const processFile = require("../middlewares/upload");
const ValidationError = require('./notifications/errors/validation');
const { resolveOrganizationIdForWrite } = require('../helpers/currentUser');
const csv = require('csv-parser');
const stream = require('stream');





module.exports = class PayersService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const organizationId = resolveOrganizationIdForWrite(data, currentUser);

      if (!organizationId) {
        throw new ValidationError(
          'organizationRequired',
          'Organization is required to create a payer',
        );
      }

      await PayersDBApi.create(
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

      await PayersDBApi.bulkImport(results, {
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
      let payers = await PayersDBApi.findBy(
        {id},
        {transaction},
      );

      if (!payers) {
        throw new ValidationError(
          'payersNotFound',
        );
      }

      const updatedPayers = await PayersDBApi.update(
        id,
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      return updatedPayers;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteByIds(ids, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await PayersDBApi.deleteByIds(ids, {
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
      await PayersDBApi.remove(
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
