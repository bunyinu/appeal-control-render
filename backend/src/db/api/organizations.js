
const db = require('../models');
const Utils = require('../utils');



const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class OrganizationsDBApi {
    

    
    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const organizations = await db.organizations.create(
            {
                id: data.id || undefined,
        
        name: data.name
        ||
        null
            ,
            
            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        

        

        

        return organizations;
    }
    

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const organizationsData = data.map((item, index) => ({
                id: item.id || undefined,
                
                name: item.name
            ||
            null
            ,
            
            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const organizations = await db.organizations.bulkCreate(organizationsData, { transaction });

        // For each item created, replace relation files
        

        return organizations;
    }

    static async update(id, data,  options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const organizations = await db.organizations.findByPk(id, {}, {transaction});


        

        const updatePayload = {};
        
        if (data.name !== undefined) updatePayload.name = data.name;
        
        
        updatePayload.updatedById = currentUser.id;

        await organizations.update(updatePayload, {transaction});

        
        

        
        

        

        return organizations;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const organizations = await db.organizations.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of organizations) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of organizations) {
                await record.destroy({transaction});
            }
        });


        return organizations;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const organizations = await db.organizations.findByPk(id, options);

        await organizations.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await organizations.destroy({
            transaction
        });

        return organizations;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const organizations = await db.organizations.findOne(
            { where },
            { transaction },
        );

        if (!organizations) {
            return organizations;
        }

        const output = organizations.get({plain: true});

        
        output.users_organizations = await organizations.getUsers_organizations({
            transaction
        });
        
        
        
        
        
        output.payers_organization = await organizations.getPayers_organization({
            transaction
        });
        
        
        output.cases_organization = await organizations.getCases_organization({
            transaction
        });
        
        
        output.tasks_organization = await organizations.getTasks_organization({
            transaction
        });
        
        
        output.documents_organization = await organizations.getDocuments_organization({
            transaction
        });
        
        
        output.appeal_drafts_organization = await organizations.getAppeal_drafts_organization({
            transaction
        });
        
        
        output.notes_organization = await organizations.getNotes_organization({
            transaction
        });
        
        
        output.activity_logs_organization = await organizations.getActivity_logs_organization({
            transaction
        });
        
        
        output.settings_organization = await organizations.getSettings_organization({
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
                where.organizationsId = options.currentUser.organizationsId;
            }
        }
        

        offset = currentPage * limit;

    let include = [



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
                        'organizations',
                        'name',
                        filter.name,
                    ),
                };
            }
            

            
            

            

            if (filter.active !== undefined) {
                where = {
                    ...where,
                    active: filter.active === true || filter.active === 'true'
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
            delete where.organizationsId;
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
            const { rows, count } = await db.organizations.findAndCountAll(queryOptions);

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
            where.id = organizationId;
        }
        

        if (query) {
            where = {
                ...where,
                [Op.or]: [
                    { ['id']: Utils.uuid(query) },
                    Utils.ilike(
                        'organizations',
                        'name',
                        query,
                    ),
                ],
            };
        }

        const records = await db.organizations.findAll({
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
