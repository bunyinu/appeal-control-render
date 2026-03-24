const db = require('../db/models');
const SettingsDBApi = require('../db/api/settings');
const processFile = require("../middlewares/upload");
const ValidationError = require('./notifications/errors/validation');
const { resolveOrganizationIdForWrite } = require('../helpers/currentUser');
const csv = require('csv-parser');
const stream = require('stream');





module.exports = class SettingsService {
  static async create(data, currentUser) {
    const transaction = await db.sequelize.transaction();
    try {
      const organizationId = resolveOrganizationIdForWrite(data, currentUser);

      if (!organizationId) {
        throw new ValidationError(
          'organizationRequired',
          'Organization is required to create a setting',
        );
      }

      await SettingsDBApi.create(
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

      await SettingsDBApi.bulkImport(results, {
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
      let settings = await SettingsDBApi.findBy(
        {id},
        {transaction},
      );

      if (!settings) {
        throw new ValidationError(
          'settingsNotFound',
        );
      }

      const updatedSettings = await SettingsDBApi.update(
        id,
        data,
        {
          currentUser,
          transaction,
        },
      );

      await transaction.commit();
      return updatedSettings;

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  static async deleteByIds(ids, currentUser) {
    const transaction = await db.sequelize.transaction();

    try {
      await SettingsDBApi.deleteByIds(ids, {
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
      await SettingsDBApi.remove(
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
