
const db = require('../models');
const FileDBApi = require('./file');
const Utils = require('../utils');
const { resolveOrganizationIdForWrite } = require('../../helpers/currentUser');



const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class DocumentsDBApi {
    

    
    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const documents = await db.documents.create(
            {
                id: data.id || undefined,
        
        category: data.category
        ||
        null
            ,
            
        title: data.title
        ||
        null
            ,
            
        description: data.description
        ||
        null
            ,
            
        is_confidential: data.is_confidential
        ||
        false
        
            ,
            
        received_at: data.received_at
        ||
        null
            ,
            
            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        
        await documents.setOrganization(resolveOrganizationIdForWrite(data, currentUser), {
            transaction,
        });
        
        await documents.setCase( data.case || null, {
            transaction,
        });
        
        await documents.setUploaded_by_user( data.uploaded_by_user || null, {
            transaction,
        });
        

        

        
        await FileDBApi.replaceRelationFiles(
            {
                belongsTo: db.documents.getTableName(),
                belongsToColumn: 'file',
                belongsToId: documents.id,
            },
            data.file,
            options,
        );
        

        return documents;
    }
    

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const documentsData = data.map((item, index) => ({
                id: item.id || undefined,
                
                category: item.category
            ||
            null
            ,
            
                title: item.title
            ||
            null
            ,
            
                description: item.description
            ||
            null
            ,
            
                is_confidential: item.is_confidential
            ||
            false
        
            ,
            
                received_at: item.received_at
            ||
            null
            ,
            
            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const documents = await db.documents.bulkCreate(documentsData, { transaction });

        // For each item created, replace relation files
        
        for (let i = 0; i < documents.length; i++) {
            await FileDBApi.replaceRelationFiles(
                {
                    belongsTo: db.documents.getTableName(),
                    belongsToColumn: 'file',
                    belongsToId: documents[i].id,
                },
                data[i].file,
                options,
            );
        }
        

        return documents;
    }

    static async update(id, data,  options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const documents = await db.documents.findByPk(id, {}, {transaction});


        

        const updatePayload = {};
        
        if (data.category !== undefined) updatePayload.category = data.category;
        
        
        if (data.title !== undefined) updatePayload.title = data.title;
        
        
        if (data.description !== undefined) updatePayload.description = data.description;
        
        
        if (data.is_confidential !== undefined) updatePayload.is_confidential = data.is_confidential;
        
        
        if (data.received_at !== undefined) updatePayload.received_at = data.received_at;
        
        
        updatePayload.updatedById = currentUser.id;

        await documents.update(updatePayload, {transaction});

        
        
        if (data.organization !== undefined) {
            await documents.setOrganization(
              
              resolveOrganizationIdForWrite(data, currentUser),
              
              { transaction }
            );
        }
        
        if (data.case !== undefined) {
            await documents.setCase(
              
              data.case,
              
              { transaction }
            );
        }
        
        if (data.uploaded_by_user !== undefined) {
            await documents.setUploaded_by_user(
              
              data.uploaded_by_user,
              
              { transaction }
            );
        }
        

        
        

        
        await FileDBApi.replaceRelationFiles(
            {
                belongsTo: db.documents.getTableName(),
                belongsToColumn: 'file',
                belongsToId: documents.id,
            },
            data.file,
            options,
        );
        

        return documents;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const documents = await db.documents.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of documents) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of documents) {
                await record.destroy({transaction});
            }
        });


        return documents;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const documents = await db.documents.findByPk(id, options);

        await documents.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await documents.destroy({
            transaction
        });

        return documents;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const documents = await db.documents.findOne(
            { where },
            { transaction },
        );

        if (!documents) {
            return documents;
        }

        const output = documents.get({plain: true});

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        output.organization = await documents.getOrganization({
            transaction
        });
        
        
        output.case = await documents.getCase({
            transaction
        });
        
        
        output.uploaded_by_user = await documents.getUploaded_by_user({
            transaction
        });
        
        
        output.file = await documents.getFile({
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
        as: 'uploaded_by_user',
        required: Boolean(filter.uploaded_by_user),
        where: filter.uploaded_by_user ? {
          [Op.or]: [
            { id: { [Op.in]: filter.uploaded_by_user.split('|').map(term => Utils.uuid(term)) } },
            {
              firstName: {
                [Op.or]: filter.uploaded_by_user.split('|').map(term => ({ [Op.iLike]: `%${term}%` }))
              }
            },
          ]
        } : undefined,
      },



      {
        model: db.file,
        as: 'file',
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
                        'documents',
                        'title',
                        filter.title,
                    ),
                };
            }
            
            if (filter.description) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'documents',
                        'description',
                        filter.description,
                    ),
                };
            }
            

            
            

            
            if (filter.received_atRange) {
                const [start, end] = filter.received_atRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    received_at: {
                    ...where.received_at,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    received_at: {
                    ...where.received_at,
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

            
            if (filter.category) {
                where = {
                    ...where,
                category: filter.category,
            };
            }
            
            if (filter.is_confidential) {
                where = {
                    ...where,
                is_confidential: filter.is_confidential,
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
            const { rows, count } = await db.documents.findAndCountAll(queryOptions);

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
                        'documents',
                        'title',
                        query,
                    ),
                ],
            };
        }

        const records = await db.documents.findAll({
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
