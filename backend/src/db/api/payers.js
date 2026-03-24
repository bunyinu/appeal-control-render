
const db = require('../models');
const Utils = require('../utils');
const { resolveOrganizationIdForWrite } = require('../../helpers/currentUser');



const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class PayersDBApi {
    

    
    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const payers = await db.payers.create(
            {
                id: data.id || undefined,
        
        name: data.name
        ||
        null
            ,
            
        payer_code: data.payer_code
        ||
        null
            ,
            
        plan_type: data.plan_type
        ||
        null
            ,
            
        claims_address: data.claims_address
        ||
        null
            ,
            
        fax_number: data.fax_number
        ||
        null
            ,
            
        portal_url: data.portal_url
        ||
        null
            ,
            
        appeals_submission_method: data.appeals_submission_method
        ||
        null
            ,
            
        appeals_contact: data.appeals_contact
        ||
        null
            ,
            
        is_active: data.is_active
        ||
        false
        
            ,
            
            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        
        await payers.setOrganization(resolveOrganizationIdForWrite(data, currentUser), {
            transaction,
        });
        

        

        

        return payers;
    }
    

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const payersData = data.map((item, index) => ({
                id: item.id || undefined,
                
                name: item.name
            ||
            null
            ,
            
                payer_code: item.payer_code
            ||
            null
            ,
            
                plan_type: item.plan_type
            ||
            null
            ,
            
                claims_address: item.claims_address
            ||
            null
            ,
            
                fax_number: item.fax_number
            ||
            null
            ,
            
                portal_url: item.portal_url
            ||
            null
            ,
            
                appeals_submission_method: item.appeals_submission_method
            ||
            null
            ,
            
                appeals_contact: item.appeals_contact
            ||
            null
            ,
            
                is_active: item.is_active
            ||
            false
        
            ,
            
            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const payers = await db.payers.bulkCreate(payersData, { transaction });

        // For each item created, replace relation files
        

        return payers;
    }

    static async update(id, data,  options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const payers = await db.payers.findByPk(id, {}, {transaction});


        

        const updatePayload = {};
        
        if (data.name !== undefined) updatePayload.name = data.name;
        
        
        if (data.payer_code !== undefined) updatePayload.payer_code = data.payer_code;
        
        
        if (data.plan_type !== undefined) updatePayload.plan_type = data.plan_type;
        
        
        if (data.claims_address !== undefined) updatePayload.claims_address = data.claims_address;
        
        
        if (data.fax_number !== undefined) updatePayload.fax_number = data.fax_number;
        
        
        if (data.portal_url !== undefined) updatePayload.portal_url = data.portal_url;
        
        
        if (data.appeals_submission_method !== undefined) updatePayload.appeals_submission_method = data.appeals_submission_method;
        
        
        if (data.appeals_contact !== undefined) updatePayload.appeals_contact = data.appeals_contact;
        
        
        if (data.is_active !== undefined) updatePayload.is_active = data.is_active;
        
        
        updatePayload.updatedById = currentUser.id;

        await payers.update(updatePayload, {transaction});

        
        
        if (data.organization !== undefined) {
            await payers.setOrganization(
              
              resolveOrganizationIdForWrite(data, currentUser),
              
              { transaction }
            );
        }
        

        
        

        

        return payers;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const payers = await db.payers.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of payers) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of payers) {
                await record.destroy({transaction});
            }
        });


        return payers;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const payers = await db.payers.findByPk(id, options);

        await payers.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await payers.destroy({
            transaction
        });

        return payers;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const payers = await db.payers.findOne(
            { where },
            { transaction },
        );

        if (!payers) {
            return payers;
        }

        const output = payers.get({plain: true});

        
        
        
        
        
        
        output.cases_payer = await payers.getCases_payer({
            transaction
        });
        
        
        
        
        
        
        
        
        
        output.organization = await payers.getOrganization({
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

            
            if (filter.name) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'payers',
                        'name',
                        filter.name,
                    ),
                };
            }
            
            if (filter.payer_code) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'payers',
                        'payer_code',
                        filter.payer_code,
                    ),
                };
            }
            
            if (filter.plan_type) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'payers',
                        'plan_type',
                        filter.plan_type,
                    ),
                };
            }
            
            if (filter.claims_address) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'payers',
                        'claims_address',
                        filter.claims_address,
                    ),
                };
            }
            
            if (filter.fax_number) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'payers',
                        'fax_number',
                        filter.fax_number,
                    ),
                };
            }
            
            if (filter.portal_url) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'payers',
                        'portal_url',
                        filter.portal_url,
                    ),
                };
            }
            
            if (filter.appeals_submission_method) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'payers',
                        'appeals_submission_method',
                        filter.appeals_submission_method,
                    ),
                };
            }
            
            if (filter.appeals_contact) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'payers',
                        'appeals_contact',
                        filter.appeals_contact,
                    ),
                };
            }
            

            
            

            

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
                };
            }

            
            if (filter.is_active) {
                where = {
                    ...where,
                is_active: filter.is_active,
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
            const { rows, count } = await db.payers.findAndCountAll(queryOptions);

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
                        'payers',
                        'name',
                        query,
                    ),
                ],
            };
        }

        const records = await db.payers.findAll({
            attributes: [ 'id', 'name' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order: [['name', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.name,
        }));
    }

    
};
