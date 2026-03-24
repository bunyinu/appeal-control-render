
const db = require('../models');
const Utils = require('../utils');
const { resolveOrganizationIdForWrite } = require('../../helpers/currentUser');



const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class NotesDBApi {
    

    
    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.create(
            {
                id: data.id || undefined,
        
        title: data.title
        ||
        null
            ,
            
        body: data.body
        ||
        null
            ,
            
        is_private: data.is_private
        ||
        false
        
            ,
            
        note_type: data.note_type
        ||
        null
            ,
            
            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        
        await notes.setOrganization(resolveOrganizationIdForWrite(data, currentUser), {
            transaction,
        });
        
        await notes.setCase( data.case || null, {
            transaction,
        });
        
        await notes.setAuthor_user( data.author_user || null, {
            transaction,
        });
        

        

        

        return notes;
    }
    

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const notesData = data.map((item, index) => ({
                id: item.id || undefined,
                
                title: item.title
            ||
            null
            ,
            
                body: item.body
            ||
            null
            ,
            
                is_private: item.is_private
            ||
            false
        
            ,
            
                note_type: item.note_type
            ||
            null
            ,
            
            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const notes = await db.notes.bulkCreate(notesData, { transaction });

        // For each item created, replace relation files
        

        return notes;
    }

    static async update(id, data,  options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.findByPk(id, {}, {transaction});


        

        const updatePayload = {};
        
        if (data.title !== undefined) updatePayload.title = data.title;
        
        
        if (data.body !== undefined) updatePayload.body = data.body;
        
        
        if (data.is_private !== undefined) updatePayload.is_private = data.is_private;
        
        
        if (data.note_type !== undefined) updatePayload.note_type = data.note_type;
        
        
        updatePayload.updatedById = currentUser.id;

        await notes.update(updatePayload, {transaction});

        
        
        if (data.organization !== undefined) {
            await notes.setOrganization(
              
              resolveOrganizationIdForWrite(data, currentUser),
              
              { transaction }
            );
        }
        
        if (data.case !== undefined) {
            await notes.setCase(
              
              data.case,
              
              { transaction }
            );
        }
        
        if (data.author_user !== undefined) {
            await notes.setAuthor_user(
              
              data.author_user,
              
              { transaction }
            );
        }
        

        
        

        

        return notes;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of notes) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of notes) {
                await record.destroy({transaction});
            }
        });


        return notes;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.findByPk(id, options);

        await notes.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await notes.destroy({
            transaction
        });

        return notes;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const notes = await db.notes.findOne(
            { where },
            { transaction },
        );

        if (!notes) {
            return notes;
        }

        const output = notes.get({plain: true});

        
        
        
        
        
        
        
        
        
        
        
        
        
        
        output.organization = await notes.getOrganization({
            transaction
        });
        
        
        output.case = await notes.getCase({
            transaction
        });
        
        
        output.author_user = await notes.getAuthor_user({
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
                        'notes',
                        'title',
                        filter.title,
                    ),
                };
            }
            
            if (filter.body) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'notes',
                        'body',
                        filter.body,
                    ),
                };
            }
            

            
            

            

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            
            if (filter.is_private) {
                where = {
                    ...where,
                is_private: filter.is_private,
            };
            }
            
            if (filter.note_type) {
                where = {
                    ...where,
                note_type: filter.note_type,
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
            const { rows, count } = await db.notes.findAndCountAll(queryOptions);

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
                        'notes',
                        'title',
                        query,
                    ),
                ],
            };
        }

        const records = await db.notes.findAll({
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
