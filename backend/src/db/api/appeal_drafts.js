
const db = require('../models');
const FileDBApi = require('./file');
const Utils = require('../utils');
const { resolveOrganizationIdForWrite } = require('../../helpers/currentUser');



const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Appeal_draftsDBApi {
    

    
    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const appeal_drafts = await db.appeal_drafts.create(
            {
                id: data.id || undefined,

        version: data.version
        ||
        1
            ,
        
        title: data.title
        ||
        null
            ,
            
        status: data.status
        ||
        null
            ,
            
        content: data.content
        ||
        null
            ,
            
        submitted_at: data.submitted_at
        ||
        null
            ,
            
            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        
        await appeal_drafts.setOrganization(resolveOrganizationIdForWrite(data, currentUser), {
            transaction,
        });
        
        await appeal_drafts.setCase( data.case || null, {
            transaction,
        });
        
        await appeal_drafts.setAuthor_user( data.author_user || null, {
            transaction,
        });
        

        

        
        await FileDBApi.replaceRelationFiles(
            {
                belongsTo: db.appeal_drafts.getTableName(),
                belongsToColumn: 'attachments',
                belongsToId: appeal_drafts.id,
            },
            data.attachments,
            options,
        );
        

        return appeal_drafts;
    }
    

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const appeal_draftsData = data.map((item, index) => ({
                id: item.id || undefined,
                
                title: item.title
            ||
            null
            ,
            
                status: item.status
            ||
            null
            ,
            
                content: item.content
            ||
            null
            ,
            
                submitted_at: item.submitted_at
            ||
            null
            ,
            
            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const appeal_drafts = await db.appeal_drafts.bulkCreate(appeal_draftsData, { transaction });

        // For each item created, replace relation files
        
        for (let i = 0; i < appeal_drafts.length; i++) {
            await FileDBApi.replaceRelationFiles(
                {
                    belongsTo: db.appeal_drafts.getTableName(),
                    belongsToColumn: 'attachments',
                    belongsToId: appeal_drafts[i].id,
                },
                data[i].attachments,
                options,
            );
        }
        

        return appeal_drafts;
    }

    static async update(id, data,  options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const appeal_drafts = await db.appeal_drafts.findByPk(id, {}, {transaction});


        

        const updatePayload = {};
        
        if (data.title !== undefined) updatePayload.title = data.title;
        
        
        if (data.status !== undefined) updatePayload.status = data.status;
        
        
        if (data.content !== undefined) updatePayload.content = data.content;
        
        
        if (data.submitted_at !== undefined) updatePayload.submitted_at = data.submitted_at;
        
        
        updatePayload.updatedById = currentUser.id;

        await appeal_drafts.update(updatePayload, {transaction});

        
        
        if (data.organization !== undefined) {
            await appeal_drafts.setOrganization(
              
              resolveOrganizationIdForWrite(data, currentUser),
              
              { transaction }
            );
        }
        
        if (data.case !== undefined) {
            await appeal_drafts.setCase(
              
              data.case,
              
              { transaction }
            );
        }
        
        if (data.author_user !== undefined) {
            await appeal_drafts.setAuthor_user(
              
              data.author_user,
              
              { transaction }
            );
        }
        

        
        

        
        await FileDBApi.replaceRelationFiles(
            {
                belongsTo: db.appeal_drafts.getTableName(),
                belongsToColumn: 'attachments',
                belongsToId: appeal_drafts.id,
            },
            data.attachments,
            options,
        );
        

        return appeal_drafts;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const appeal_drafts = await db.appeal_drafts.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of appeal_drafts) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of appeal_drafts) {
                await record.destroy({transaction});
            }
        });


        return appeal_drafts;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const appeal_drafts = await db.appeal_drafts.findByPk(id, options);

        await appeal_drafts.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await appeal_drafts.destroy({
            transaction
        });

        return appeal_drafts;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const appeal_drafts = await db.appeal_drafts.findOne(
            { where },
            { transaction },
        );

        if (!appeal_drafts) {
            return appeal_drafts;
        }

        const output = appeal_drafts.get({plain: true});

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        output.organization = await appeal_drafts.getOrganization({
            transaction
        });
        
        
        output.case = await appeal_drafts.getCase({
            transaction
        });
        
        
        output.author_user = await appeal_drafts.getAuthor_user({
            transaction
        });
        
        
        output.attachments = await appeal_drafts.getAttachments({
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
        as: 'author_user',
        required: Boolean(filter.author_user),
        where: filter.author_user ? {
          [Op.or]: [
            { id: { [Op.in]: filter.author_user.split('|').map(term => Utils.uuid(term)) } },
            {
              firstName: {
                [Op.or]: filter.author_user.split('|').map(term => ({ [Op.iLike]: `%${term}%` }))
              }
            },
          ]
        } : undefined,
      },



      {
        model: db.file,
        as: 'attachments',
        required: false,
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
                        'appeal_drafts',
                        'title',
                        filter.title,
                    ),
                };
            }
            
            if (filter.content) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'appeal_drafts',
                        'content',
                        filter.content,
                    ),
                };
            }
            

            
            

            
            if (filter.submitted_atRange) {
                const [start, end] = filter.submitted_atRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    submitted_at: {
                    ...where.submitted_at,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    submitted_at: {
                    ...where.submitted_at,
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
            const { rows, count } = await db.appeal_drafts.findAndCountAll(queryOptions);

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
                        'appeal_drafts',
                        'title',
                        query,
                    ),
                ],
            };
        }

        const records = await db.appeal_drafts.findAll({
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
