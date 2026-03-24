
const db = require('../models');
const Utils = require('../utils');
const { resolveOrganizationIdForWrite } = require('../../helpers/currentUser');



const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class CasesDBApi {
    

    
    static async create(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const cases = await db.cases.create(
            {
                id: data.id || undefined,
        
        case_number: data.case_number
        ||
        null
            ,
            
        patient_name: data.patient_name
        ||
        null
            ,
            
        patient_dob: data.patient_dob
        ||
        null
            ,
            
        member_id: data.member_id
        ||
        null
            ,
            
        procedure_code: data.procedure_code
        ||
        null
            ,
            
        diagnosis_code: data.diagnosis_code
        ||
        null
            ,
            
        denial_reason_code: data.denial_reason_code
        ||
        null
            ,
            
        denial_reason: data.denial_reason
        ||
        null
            ,
            
        facility_name: data.facility_name
        ||
        null
            ,
            
        ordering_provider: data.ordering_provider
        ||
        null
            ,
            
        amount_at_risk: data.amount_at_risk
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
            
        submitted_at: data.submitted_at
        ||
        null
            ,
            
        due_at: data.due_at
        ||
        null
            ,
            
        closed_at: data.closed_at
        ||
        null
            ,
            
        outcome: data.outcome
        ||
        null
            ,
            
            importHash: data.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
    },
        { transaction },
    );

        
        await cases.setOrganization(resolveOrganizationIdForWrite(data, currentUser), {
            transaction,
        });
        
        await cases.setPayer( data.payer || null, {
            transaction,
        });
        
        await cases.setOwner_user( data.owner_user || null, {
            transaction,
        });
        

        

        

        return cases;
    }
    

    static async bulkImport(data, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        // Prepare data - wrapping individual data transformations in a map() method
        const casesData = data.map((item, index) => ({
                id: item.id || undefined,
                
                case_number: item.case_number
            ||
            null
            ,
            
                patient_name: item.patient_name
            ||
            null
            ,
            
                patient_dob: item.patient_dob
            ||
            null
            ,
            
                member_id: item.member_id
            ||
            null
            ,
            
                procedure_code: item.procedure_code
            ||
            null
            ,
            
                diagnosis_code: item.diagnosis_code
            ||
            null
            ,
            
                denial_reason_code: item.denial_reason_code
            ||
            null
            ,
            
                denial_reason: item.denial_reason
            ||
            null
            ,
            
                facility_name: item.facility_name
            ||
            null
            ,
            
                ordering_provider: item.ordering_provider
            ||
            null
            ,
            
                amount_at_risk: item.amount_at_risk
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
            
                submitted_at: item.submitted_at
            ||
            null
            ,
            
                due_at: item.due_at
            ||
            null
            ,
            
                closed_at: item.closed_at
            ||
            null
            ,
            
                outcome: item.outcome
            ||
            null
            ,
            
            importHash: item.importHash || null,
            createdById: currentUser.id,
            updatedById: currentUser.id,
            createdAt: new Date(Date.now() + index * 1000),
    }));

        // Bulk create items
        const cases = await db.cases.bulkCreate(casesData, { transaction });

        // For each item created, replace relation files
        

        return cases;
    }

    static async update(id, data,  options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const cases = await db.cases.findByPk(id, {}, {transaction});


        

        const updatePayload = {};
        
        if (data.case_number !== undefined) updatePayload.case_number = data.case_number;
        
        
        if (data.patient_name !== undefined) updatePayload.patient_name = data.patient_name;
        
        
        if (data.patient_dob !== undefined) updatePayload.patient_dob = data.patient_dob;
        
        
        if (data.member_id !== undefined) updatePayload.member_id = data.member_id;
        
        
        if (data.procedure_code !== undefined) updatePayload.procedure_code = data.procedure_code;
        
        
        if (data.diagnosis_code !== undefined) updatePayload.diagnosis_code = data.diagnosis_code;
        
        
        if (data.denial_reason_code !== undefined) updatePayload.denial_reason_code = data.denial_reason_code;
        
        
        if (data.denial_reason !== undefined) updatePayload.denial_reason = data.denial_reason;
        
        
        if (data.facility_name !== undefined) updatePayload.facility_name = data.facility_name;
        
        
        if (data.ordering_provider !== undefined) updatePayload.ordering_provider = data.ordering_provider;
        
        
        if (data.amount_at_risk !== undefined) updatePayload.amount_at_risk = data.amount_at_risk;
        
        
        if (data.status !== undefined) updatePayload.status = data.status;
        
        
        if (data.priority !== undefined) updatePayload.priority = data.priority;
        
        
        if (data.submitted_at !== undefined) updatePayload.submitted_at = data.submitted_at;
        
        
        if (data.due_at !== undefined) updatePayload.due_at = data.due_at;
        
        
        if (data.closed_at !== undefined) updatePayload.closed_at = data.closed_at;
        
        
        if (data.outcome !== undefined) updatePayload.outcome = data.outcome;
        
        
        updatePayload.updatedById = currentUser.id;

        await cases.update(updatePayload, {transaction});

        
        
        if (data.organization !== undefined) {
            await cases.setOrganization(
              
              resolveOrganizationIdForWrite(data, currentUser),
              
              { transaction }
            );
        }
        
        if (data.payer !== undefined) {
            await cases.setPayer(
              
              data.payer,
              
              { transaction }
            );
        }
        
        if (data.owner_user !== undefined) {
            await cases.setOwner_user(
              
              data.owner_user,
              
              { transaction }
            );
        }
        

        
        

        

        return cases;
    }

    static async deleteByIds(ids, options) {
        const currentUser = (options && options.currentUser) || { id: null };
        const transaction = (options && options.transaction) || undefined;

        const cases = await db.cases.findAll({
            where: {
                id: {
                    [Op.in]: ids,
                },
            },
            transaction,
        });

        await db.sequelize.transaction(async (transaction) => {
            for (const record of cases) {
                await record.update(
                    {deletedBy: currentUser.id},
                    {transaction}
                );
            }
            for (const record of cases) {
                await record.destroy({transaction});
            }
        });


        return cases;
    }

    static async remove(id, options) {
        const currentUser = (options && options.currentUser) || {id: null};
        const transaction = (options && options.transaction) || undefined;

        const cases = await db.cases.findByPk(id, options);

        await cases.update({
            deletedBy: currentUser.id
        }, {
            transaction,
        });

        await cases.destroy({
            transaction
        });

        return cases;
    }

    static async findBy(where, options) {
        const transaction = (options && options.transaction) || undefined;

        const cases = await db.cases.findOne(
            { where },
            { transaction },
        );

        if (!cases) {
            return cases;
        }

        const output = cases.get({plain: true});

        
        
        
        
        
        
        
        output.tasks_case = await cases.getTasks_case({
            transaction
        });
        
        
        output.documents_case = await cases.getDocuments_case({
            transaction
        });
        
        
        output.appeal_drafts_case = await cases.getAppeal_drafts_case({
            transaction
        });
        
        
        output.notes_case = await cases.getNotes_case({
            transaction
        });
        
        
        output.activity_logs_case = await cases.getActivity_logs_case({
            transaction
        });
        
        
        
        
        output.organization = await cases.getOrganization({
            transaction
        });
        
        
        output.payer = await cases.getPayer({
            transaction
        });
        
        
        output.owner_user = await cases.getOwner_user({
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
        model: db.payers,
        as: 'payer',
        required: Boolean(filter.payer),
        where: filter.payer ? {
          [Op.or]: [
            { id: { [Op.in]: filter.payer.split('|').map(term => Utils.uuid(term)) } },
            {
              name: {
                [Op.or]: filter.payer.split('|').map(term => ({ [Op.iLike]: `%${term}%` }))
              }
            },
          ]
        } : undefined,
      },

      {
        model: db.users,
        as: 'owner_user',
        required: Boolean(filter.owner_user),
        where: filter.owner_user ? {
          [Op.or]: [
            { id: { [Op.in]: filter.owner_user.split('|').map(term => Utils.uuid(term)) } },
            {
              firstName: {
                [Op.or]: filter.owner_user.split('|').map(term => ({ [Op.iLike]: `%${term}%` }))
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

            
            if (filter.case_number) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'cases',
                        'case_number',
                        filter.case_number,
                    ),
                };
            }
            
            if (filter.patient_name) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'cases',
                        'patient_name',
                        filter.patient_name,
                    ),
                };
            }
            
            if (filter.member_id) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'cases',
                        'member_id',
                        filter.member_id,
                    ),
                };
            }
            
            if (filter.procedure_code) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'cases',
                        'procedure_code',
                        filter.procedure_code,
                    ),
                };
            }
            
            if (filter.diagnosis_code) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'cases',
                        'diagnosis_code',
                        filter.diagnosis_code,
                    ),
                };
            }
            
            if (filter.denial_reason_code) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'cases',
                        'denial_reason_code',
                        filter.denial_reason_code,
                    ),
                };
            }
            
            if (filter.denial_reason) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'cases',
                        'denial_reason',
                        filter.denial_reason,
                    ),
                };
            }
            
            if (filter.facility_name) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'cases',
                        'facility_name',
                        filter.facility_name,
                    ),
                };
            }
            
            if (filter.ordering_provider) {
                where = {
                    ...where,
                    [Op.and]: Utils.ilike(
                        'cases',
                        'ordering_provider',
                        filter.ordering_provider,
                    ),
                };
            }
            

            
            

            
            if (filter.patient_dobRange) {
                const [start, end] = filter.patient_dobRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    patient_dob: {
                    ...where.patient_dob,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    patient_dob: {
                    ...where.patient_dob,
                            [Op.lte]: end,
                    },
                };
                }
            }
            
            if (filter.amount_at_riskRange) {
                const [start, end] = filter.amount_at_riskRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    amount_at_risk: {
                    ...where.amount_at_risk,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    amount_at_risk: {
                    ...where.amount_at_risk,
                            [Op.lte]: end,
                    },
                };
                }
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
            
            if (filter.closed_atRange) {
                const [start, end] = filter.closed_atRange;

                if (start !== undefined && start !== null && start !== '') {
                    where = {
                        ...where,
                    closed_at: {
                    ...where.closed_at,
                            [Op.gte]: start,
                    },
                };
                }

                if (end !== undefined && end !== null && end !== '') {
                    where = {
                        ...where,
                    closed_at: {
                    ...where.closed_at,
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
            
            if (filter.outcome) {
                where = {
                    ...where,
                outcome: filter.outcome,
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
            const { rows, count } = await db.cases.findAndCountAll(queryOptions);

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
                        'cases',
                        'case_number',
                        query,
                    ),
                ],
            };
        }

        const records = await db.cases.findAll({
            attributes: [ 'id', 'case_number' ],
            where,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order: [['case_number', 'ASC']],
        });

        return records.map((record) => ({
            id: record.id,
            label: record.case_number,
        }));
    }

    
};
