
const db = require('../models');
const Utils = require('../utils');
const { resolveOrganizationIdForWrite } = require('../../helpers/currentUser');



const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class TasksDBApi {
    

    
    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const tasks = await db.tasks.create(
            {
                id: data.id || undefined,
        
        title: data.title
        ||
        null
            ,
            
        description: data.description
        ||
        null
            ,
            
        status: data.status
        ||
        null
            ,
            
        priority: data.priority
        ||
        null
            ,
            
        due_at: data.due_at
        ||
        null
            ,
            
        completed_at: data.completed_at
        ||
        null
            ,
            
            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        
        await tasks.setOrganization(resolveOrganizationIdForWrite(data, currentUser), {
            transaction,
        });
        
        await tasks.setCase( data.case || null, {
            transaction,
        });
        
        await tasks.setAssignee_user( data.assignee_user || null, {
            transaction,
        });
        

        

        

        return tasks;
    }
    

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const tasksData = data.map((item, index) => ({
                id: item.id || undefined,
                
                title: item.title
            ||
            null
            ,
            
                description: item.description
            ||
            null
            ,
            
                status: item.status
            ||
            null
            ,
            
                priority: item.priority
            ||
            null
            ,
            
                due_at: item.due_at
            ||
            null
            ,
            
                completed_at: item.completed_at
            ||
            null
            ,
            
            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const tasks = await db.tasks.bulkCreate(tasksData, { transaction });

        // For each item created, replace relation files
        

        return tasks;
    }

    static async update(id, data,  options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const tasks = await db.tasks.findByPk(id, {}, {transaction});


        

        const updatePayload = {};
        
        if (data.title !== undefined) updatePayload.title = data.title;
        
        
        if (data.description !== undefined) updatePayload.description = data.description;
        
        
        if (data.status !== undefined) updatePayload.status = data.status;
        
        
        if (data.priority !== undefined) updatePayload.priority = data.priority;
        
        
        if (data.due_at !== undefined) updatePayload.due_at = data.due_at;
        
        
        if (data.completed_at !== undefined) updatePayload.completed_at = data.completed_at;
        
        
        updatePayload.updatedById = currentUser.id;

        await tasks.update(updatePayload, {transaction});

        
        
        if (data.organization !== undefined) {
            await tasks.setOrganization(
              
              resolveOrganizationIdForWrite(data, currentUser),
              
              { transaction }
            );
        }
        
        if (data.case !== undefined) {
            await tasks.setCase(
              
              data.case,
              
              { transaction }
            );
        }
        
        if (data.assignee_user !== undefined) {
            await tasks.setAssignee_user(
              
              data.assignee_user,
              
              { transaction }
            );
        }
        

        
        

        

        return tasks;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const tasks = await db.tasks.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of tasks) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of tasks) {
                await record.destroy({transaction});
            }
        });


        return tasks;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const tasks = await db.tasks.findByPk(id, options);

        await tasks.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await tasks.destroy({
            transaction
        });

        return tasks;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const tasks = await db.tasks.findOne(
            { where },
            { transaction },
        );

        if (!tasks) {
            return tasks;
        }

        const output = tasks.get({plain: true});

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        output.organization = await tasks.getOrganization({
            transaction
        });
        
        
        output.case = await tasks.getCase({
            transaction
        });
        
        
        output.assignee_user = await tasks.getAssignee_user({
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
        as: 'assignee_user',
        required: Boolean(filter.assignee_user),
        where: filter.assignee_user ? {
          [Op.or]: [
            { id: { [Op.in]: filter.assignee_user.split('|').map(term => Utils.uuid(term)) } },
            {
              firstName: {
                [Op.or]: filter.assignee_user.split('|').map(term => ({ [Op.iLike]: `%${term}%` }))
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

            
            if (filter.title) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'tasks',
                        'title',
                        filter.title,
                    ),
                };
            }
            
            if (filter.description) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'tasks',
                        'description',
                        filter.description,
                    ),
                };
            }
            

            
            
            if (filter.calendarStart && filter.calendarEnd) {
                where = {
                    ...where,
                    [Op.or]: [
                        {
                            due_at: {
                                [Op.between]: [filter.calendarStart, filter.calendarEnd],
                            },
                    },
                {
                    completed_at: {
                        [Op.between]: [filter.calendarStart, filter.calendarEnd],
                    },
                },
                ],
            };
            }
            

            
            if (filter.due_atRange) {
                const [start, end] = filter.due_atRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    due_at: {
                    ...where.due_at,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    due_at: {
                    ...where.due_at,
                            [Op.lte]: end,
                    },
                };
                }
            }
            
            if (filter.completed_atRange) {
                const [start, end] = filter.completed_atRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    completed_at: {
                    ...where.completed_at,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    completed_at: {
                    ...where.completed_at,
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

            
            if (filter.status) {
                where = {
                    ...where,
                status: filter.status,
            };
            }
            
            if (filter.priority) {
                where = {
                    ...where,
                priority: filter.priority,
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
            const { rows, count } = await db.tasks.findAndCountAll(queryOptions);

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
                        'tasks',
                        'title',
                        query,
                    ),
                ],
            };
        }

        const records = await db.tasks.findAll({
            attributes: [ 'id', 'title' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order: [['title', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.title,
        }));
    }

    
};
