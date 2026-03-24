
const db = require('../models');
const Utils = require('../utils');
const { resolveOrganizationIdForWrite } = require('../../helpers/currentUser');



const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Activity_logsDBApi {
    

    
    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const activity_logs = await db.activity_logs.create(
            {
                id: data.id || undefined,
        
        entity_type: data.entity_type
        ||
        null
            ,
            
        entity_key: data.entity_key
        ||
        null
            ,
            
        action: data.action
        ||
        null
            ,
            
        message: data.message
        ||
        null
            ,
            
        occurred_at: data.occurred_at
        ||
        null
            ,
            
        ip_address: data.ip_address
        ||
        null
            ,
            
            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        
        await activity_logs.setOrganization(resolveOrganizationIdForWrite(data, currentUser), {
            transaction,
        });
        
        await activity_logs.setCase( data.case || null, {
            transaction,
        });
        
        await activity_logs.setActor_user( data.actor_user || null, {
            transaction,
        });
        

        

        

        return activity_logs;
    }
    

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const activity_logsData = data.map((item, index) => ({
                id: item.id || undefined,
                
                entity_type: item.entity_type
            ||
            null
            ,
            
                entity_key: item.entity_key
            ||
            null
            ,
            
                action: item.action
            ||
            null
            ,
            
                message: item.message
            ||
            null
            ,
            
                occurred_at: item.occurred_at
            ||
            null
            ,
            
                ip_address: item.ip_address
            ||
            null
            ,
            
            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const activity_logs = await db.activity_logs.bulkCreate(activity_logsData, { transaction });

        // For each item created, replace relation files
        

        return activity_logs;
    }

    static async update(id, data,  options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const activity_logs = await db.activity_logs.findByPk(id, {}, {transaction});


        

        const updatePayload = {};
        
        if (data.entity_type !== undefined) updatePayload.entity_type = data.entity_type;
        
        
        if (data.entity_key !== undefined) updatePayload.entity_key = data.entity_key;
        
        
        if (data.action !== undefined) updatePayload.action = data.action;
        
        
        if (data.message !== undefined) updatePayload.message = data.message;
        
        
        if (data.occurred_at !== undefined) updatePayload.occurred_at = data.occurred_at;
        
        
        if (data.ip_address !== undefined) updatePayload.ip_address = data.ip_address;
        
        
        updatePayload.updatedById = currentUser.id;

        await activity_logs.update(updatePayload, {transaction});

        
        
        if (data.organization !== undefined) {
            await activity_logs.setOrganization(
              
              resolveOrganizationIdForWrite(data, currentUser),
              
              { transaction }
            );
        }
        
        if (data.case !== undefined) {
            await activity_logs.setCase(
              
              data.case,
              
              { transaction }
            );
        }
        
        if (data.actor_user !== undefined) {
            await activity_logs.setActor_user(
              
              data.actor_user,
              
              { transaction }
            );
        }
        

        
        

        

        return activity_logs;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const activity_logs = await db.activity_logs.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of activity_logs) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of activity_logs) {
                await record.destroy({transaction});
            }
        });


        return activity_logs;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const activity_logs = await db.activity_logs.findByPk(id, options);

        await activity_logs.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await activity_logs.destroy({
            transaction
        });

        return activity_logs;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const activity_logs = await db.activity_logs.findOne(
            { where },
            { transaction },
        );

        if (!activity_logs) {
            return activity_logs;
        }

        const output = activity_logs.get({plain: true});

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        output.organization = await activity_logs.getOrganization({
            transaction
        });
        
        
        output.case = await activity_logs.getCase({
            transaction
        });
        
        
        output.actor_user = await activity_logs.getActor_user({
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
        required: false,
      },

      {
        model: db.cases,
        as: 'case',
        required: Boolean(filter.case),
        where: filter.case ? {
          [Op.or]: [
            { id: { [Op.in]: filter.case.split('|').map(term => Utils.uuid(term)) } },
            {
              case_number: {
                [Op.or]: filter.case.split('|').map(term => ({ [Op.iLike]: `%${term}%` }))
              }
            },
          ]
        } : undefined,
      },

      {
        model: db.users,
        as: 'actor_user',
        required: Boolean(filter.actor_user),
        where: filter.actor_user ? {
          [Op.or]: [
            { id: { [Op.in]: filter.actor_user.split('|').map(term => Utils.uuid(term)) } },
            {
              firstName: {
                [Op.or]: filter.actor_user.split('|').map(term => ({ [Op.iLike]: `%${term}%` }))
              }
            },
          ]
        } : undefined,
      },



    ];

        if (filter) {
            if (filter.id) {
                where = {
                    ...where,
                    ['id']: Utils.uuid(filter.id),
                };
            }

            
            if (filter.entity_key) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'activity_logs',
                        'entity_key',
                        filter.entity_key,
                    ),
                };
            }
            
            if (filter.message) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'activity_logs',
                        'message',
                        filter.message,
                    ),
                };
            }
            
            if (filter.ip_address) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'activity_logs',
                        'ip_address',
                        filter.ip_address,
                    ),
                };
            }
            

            
            

            
            if (filter.occurred_atRange) {
                const [start, end] = filter.occurred_atRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    occurred_at: {
                    ...where.occurred_at,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    occurred_at: {
                    ...where.occurred_at,
                            [Op.lte]: end,
                    },
                };
                }
            }
            

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            
            if (filter.entity_type) {
                where = {
                    ...where,
                entity_type: filter.entity_type,
            };
            }
            
            if (filter.action) {
                where = {
                    ...where,
                action: filter.action,
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
            logging: console.log
        };

        if (!options?.countOnly) {
            queryOptions.limit = limit ? Number(limit) : undefined;
            queryOptions.offset = offset ? Number(offset) : undefined;
        }

        try {
            const { rows, count } = await db.activity_logs.findAndCountAll(queryOptions);

            return {
                rows: options?.countOnly ? [] : rows,
                count: count
            };
        } catch (error) {
            console.error('Error executing query:', error);
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
                        'activity_logs',
                        'entity_key',
                        query,
                    ),
                ],
            };
        }

        const records = await db.activity_logs.findAll({
            attributes: [ 'id', 'entity_key' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order: [['entity_key', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.entity_key,
        }));
    }

    
};
