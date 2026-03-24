
const db = require('../models');
const Utils = require('../utils');
const { resolveOrganizationIdForWrite } = require('../../helpers/currentUser');
const {
    redactSensitiveData,
    maskSensitiveSettingValue,
    isMaskedSensitiveSettingValue,
} = require('../../helpers/security');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

function serializeSetting(setting) {
    if (!setting) {
        return setting;
    }

    const output = typeof setting.get === 'function'
        ? setting.get({ plain: true })
        : { ...setting };

    if (output.is_sensitive) {
        output.value = maskSensitiveSettingValue(output.value);
    }

    return output;
}

module.exports = class SettingsDBApi {
    

    
    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const settings = await db.settings.create(
            {
                id: data.id || undefined,
        
        key: data.key
        ||
        null
            ,
            
        value: data.value
        ||
        null
            ,
            
        description: data.description
        ||
        null
            ,
            
        value_type: data.value_type
        ||
        null
            ,
            
        is_sensitive: data.is_sensitive
        ||
        false
        
            ,
            
            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        
        await settings.setOrganization(resolveOrganizationIdForWrite(data, currentUser), {
            transaction,
        });
        

        

        

        return settings;
    }
    

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const settingsData = data.map((item, index) => ({
                id: item.id || undefined,
                
                key: item.key
            ||
            null
            ,
            
                value: item.value
            ||
            null
            ,
            
                description: item.description
            ||
            null
            ,
            
                value_type: item.value_type
            ||
            null
            ,
            
                is_sensitive: item.is_sensitive
            ||
            false
        
            ,
            
            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const settings = await db.settings.bulkCreate(settingsData, { transaction });

        // For each item created, replace relation files
        

        return settings;
    }

    static async update(id, data,  options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const settings = await db.settings.findByPk(id, { transaction });


        

        const updatePayload = {};
        
        if (data.key !== undefined) updatePayload.key = data.key;
        
        
        if (
            data.value !== undefined &&
            (!settings.is_sensitive || !isMaskedSensitiveSettingValue(data.value))
        ) {
            updatePayload.value = data.value;
        }
        
        
        if (data.description !== undefined) updatePayload.description = data.description;
        
        
        if (data.value_type !== undefined) updatePayload.value_type = data.value_type;
        
        
        if (data.is_sensitive !== undefined) updatePayload.is_sensitive = data.is_sensitive;
        
        
        updatePayload.updatedById = currentUser.id;

        await settings.update(updatePayload, {transaction});

        
        
        if (data.organization !== undefined) {
            await settings.setOrganization(
              
              resolveOrganizationIdForWrite(data, currentUser),
              
              { transaction }
            );
        }
        

        
        

        

        return settings;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const settings = await db.settings.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of settings) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of settings) {
                await record.destroy({transaction});
            }
        });


        return settings;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const settings = await db.settings.findByPk(id, options);

        await settings.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await settings.destroy({
            transaction
        });

        return settings;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const settings = await db.settings.findOne(
            { where, transaction },
        );

        if (!settings) {
            return settings;
        }

        const output = serializeSetting(settings);

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        output.organization = await settings.getOrganization({
            transaction
        });
        
        

        return output;
    }

    static async findAll(
          filter,
           globalAccess,  options
        ) {
        const limit = filter.limit || 0;
        let offset = 0;
        let where = {};
        const currentPage = +filter.page;

        
        const user = (options && options.currentUser) || null;
        const userOrganizations = (user && user.organizations?.id) || null;
        

        
        if (userOrganizations) {
            if (options?.currentUser?.organizationsId) {
                where.organizationId = options.currentUser.organizationsId;
            }
        }
        

        offset = currentPage * limit;

    let include = [

      {
        model: db.organizations,
        as: 'organization',
        
      },



    ];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

            
            if (filter.key) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'settings',
                        'key',
                        filter.key,
                    ),
                };
            }
            
            if (filter.value) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'settings',
                        'value',
                        filter.value,
                    ),
                };
            }
            
            if (filter.description) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'settings',
                        'description',
                        filter.description,
                    ),
                };
            }
            

            
            

            

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            
            if (filter.value_type) {
                where = {
                    ...where,
                value_type: filter.value_type,
            };
            }
            
            if (filter.is_sensitive !== undefined && filter.is_sensitive !== '') {
                where = {
                    ...where,
                is_sensitive: filter.is_sensitive === true || filter.is_sensitive === 'true',
            };
            }
            


      
      if (filter.organization) {
        const listItems = filter.organization.split('|').map(item => {
          return  Utils.uuid(item)
        });

        where = {
          ...where,
          organizationId: {[Op.or]: listItems}
        };
      }
      



            if (filter.createdAtRange) {
                const [start, end] = filter.createdAtRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.gte]: start,
                        },
                    };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                        ['createdAt']: {
                            ...where.createdAt,
                            [Op.lte]: end,
                        },
                    };
                }
            }
        }
        

        
        if (globalAccess) {
            delete where.organizationId;
        }
        

        const queryOptions = {
            where,
            include,
            distinct: true,
            order: filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction: options?.transaction,
            logging: false
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.settings.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows.map((row) => serializeSetting(row)),
                count: count
            };
        } catch (error) {
            console.error('Error executing settings query', redactSensitiveData(error));
            throw error;
        }
    }

    static async findAllAutocomplete(query, limit, offset,  globalAccess, organizationId,) {
        let where = {};
        
        
        if (!globalAccess && organizationId) {
            where.organizationId = organizationId;
        }
        

        if (query) {
            where = {
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'settings',
                        'key',
                        query,
                    ),
                ],
            };
        }

        const records = await db.settings.findAll({
            attributes: [ 'id', 'key' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order: [['key', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.key,
        }));
    }

    
};
