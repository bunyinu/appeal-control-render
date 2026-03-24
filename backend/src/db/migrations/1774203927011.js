module.exports = {
    /**
     * @param {QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     * @returns {Promise<void>}
     */
    async up(queryInterface, Sequelize) {
        /**
         * @type {Transaction}
         */
        const transaction = await queryInterface.sequelize.transaction();
        try {
            
                
                    await queryInterface.createTable('users', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('roles', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('permissions', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('organizations', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('payers', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('cases', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('tasks', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('documents', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('appeal_drafts', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('notes', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('activity_logs', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    await queryInterface.createTable('settings', {
                        id: {
                            type: Sequelize.DataTypes.UUID,
                            defaultValue: Sequelize.DataTypes.UUIDV4,
                            primaryKey: true,
                        },
                        createdById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        updatedById: {
                            type: Sequelize.DataTypes.UUID,
                            references: {
                                key: 'id',
                                model: 'users',
                            },
                        },
                        createdAt: { type: Sequelize.DataTypes.DATE },
                        updatedAt: { type: Sequelize.DataTypes.DATE },
                        deletedAt: { type: Sequelize.DataTypes.DATE },
                        importHash: {
                            type: Sequelize.DataTypes.STRING(255),
                            allowNull: true,
                          unique: true, 
                        },
                    }, { transaction });
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'firstName',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'lastName',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'phoneNumber',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'email',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'disabled',
                      {
                          type: Sequelize.DataTypes.BOOLEAN,
                          
                            defaultValue: false,
                            allowNull: false,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'password',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'emailVerified',
                      {
                          type: Sequelize.DataTypes.BOOLEAN,
                          
                            defaultValue: false,
                            allowNull: false,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'emailVerificationToken',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'emailVerificationTokenExpiresAt',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'passwordResetToken',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'passwordResetTokenExpiresAt',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'provider',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'app_roleId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'roles',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
            
                
                    
                    await queryInterface.addColumn(
                      'users',
                      'organizationsId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'organizations',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'roles',
                      'name',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'roles',
                      'role_customization',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
            
                
                    
                    await queryInterface.addColumn(
                      'roles',
                      'globalAccess',
                      {
                          type: Sequelize.DataTypes.BOOLEAN,
                          
                            defaultValue: false,
                            allowNull: false,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'permissions',
                      'name',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'organizations',
                      'name',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'organizationId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'organizations',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'name',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'payer_code',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'plan_type',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'claims_address',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'fax_number',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'portal_url',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'appeals_submission_method',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'appeals_contact',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'payers',
                      'is_active',
                      {
                          type: Sequelize.DataTypes.BOOLEAN,
                          
                            defaultValue: false,
                            allowNull: false,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'organizationId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'organizations',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'payerId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'payers',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'owner_userId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'users',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'case_number',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'patient_name',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'patient_dob',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'member_id',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'procedure_code',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'diagnosis_code',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'denial_reason_code',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'denial_reason',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'facility_name',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'ordering_provider',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'amount_at_risk',
                      {
                          type: Sequelize.DataTypes.DECIMAL,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'status',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['intake','triage','evidence_needed','appeal_ready','submitted','pending_payer','won','lost'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'priority',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['low','medium','high','urgent'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'submitted_at',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'due_at',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'closed_at',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'cases',
                      'outcome',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['unknown','won','lost','partially_won','withdrawn'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'tasks',
                      'organizationId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'organizations',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'tasks',
                      'caseId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'cases',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'tasks',
                      'assignee_userId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'users',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'tasks',
                      'title',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'tasks',
                      'description',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'tasks',
                      'status',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['todo','in_progress','blocked','done'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'tasks',
                      'priority',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['low','medium','high','urgent'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'tasks',
                      'due_at',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'tasks',
                      'completed_at',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'documents',
                      'organizationId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'organizations',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'documents',
                      'caseId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'cases',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'documents',
                      'uploaded_by_userId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'users',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'documents',
                      'category',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['denial_letter','medical_records','clinical_notes','imaging','treatment_plan','letter_of_medical_necessity','policy','authorization','claim','correspondence','other'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'documents',
                      'title',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'documents',
                      'description',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
            
                
                    
                    await queryInterface.addColumn(
                      'documents',
                      'is_confidential',
                      {
                          type: Sequelize.DataTypes.BOOLEAN,
                          
                            defaultValue: false,
                            allowNull: false,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'documents',
                      'received_at',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'appeal_drafts',
                      'organizationId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'organizations',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'appeal_drafts',
                      'caseId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'cases',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'appeal_drafts',
                      'author_userId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'users',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'appeal_drafts',
                      'title',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'appeal_drafts',
                      'status',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['draft','in_review','approved','sent','archived'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'appeal_drafts',
                      'content',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
            
                
                    
                    await queryInterface.addColumn(
                      'appeal_drafts',
                      'submitted_at',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'notes',
                      'organizationId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'organizations',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'notes',
                      'caseId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'cases',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'notes',
                      'author_userId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'users',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'notes',
                      'title',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'notes',
                      'body',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'notes',
                      'is_private',
                      {
                          type: Sequelize.DataTypes.BOOLEAN,
                          
                            defaultValue: false,
                            allowNull: false,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'notes',
                      'note_type',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['general','payer_call','clinical_review','submission','follow_up','outcome'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'activity_logs',
                      'organizationId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'organizations',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'activity_logs',
                      'caseId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'cases',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'activity_logs',
                      'actor_userId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'users',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'activity_logs',
                      'entity_type',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['case','task','document','appeal_draft','note','payer','user','setting'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'activity_logs',
                      'entity_key',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'activity_logs',
                      'action',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['created','updated','assigned','status_changed','priority_changed','submitted','uploaded','commented','deleted','restored','login'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'activity_logs',
                      'message',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'activity_logs',
                      'occurred_at',
                      {
                          type: Sequelize.DataTypes.DATE,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'activity_logs',
                      'ip_address',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'settings',
                      'organizationId',
                      {
                          type: Sequelize.DataTypes.UUID,
                          
                          
                          
                            references: {
                                model: 'organizations',
                                key: 'id',
                            },
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'settings',
                      'key',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'settings',
                      'value',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'settings',
                      'description',
                      {
                          type: Sequelize.DataTypes.TEXT,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'settings',
                      'value_type',
                      {
                          type: Sequelize.DataTypes.ENUM,
                          
                          
                            values: ['string','number','boolean','json'],
                          
                          
                      },
                      { transaction }
                    );
                
            
                
                    
                    await queryInterface.addColumn(
                      'settings',
                      'is_sensitive',
                      {
                          type: Sequelize.DataTypes.BOOLEAN,
                          
                            defaultValue: false,
                            allowNull: false,
                          
                          
                          
                      },
                      { transaction }
                    );
                
            
            
            
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    },
    /**
     * @param {QueryInterface} queryInterface
     * @param {Sequelize} Sequelize
     * @returns {Promise<void>}
     */
    async down(queryInterface) {
        /**
         * @type {Transaction}
         */
        const transaction = await queryInterface.sequelize.transaction();
        try {
            
                
                    await queryInterface.removeColumn(
                        'settings',
                        'is_sensitive',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'settings',
                        'value_type',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'settings',
                        'description',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'settings',
                        'value',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'settings',
                        'key',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'settings',
                        'organizationId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'activity_logs',
                        'ip_address',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'activity_logs',
                        'occurred_at',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'activity_logs',
                        'message',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'activity_logs',
                        'action',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'activity_logs',
                        'entity_key',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'activity_logs',
                        'entity_type',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'activity_logs',
                        'actor_userId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'activity_logs',
                        'caseId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'activity_logs',
                        'organizationId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'notes',
                        'note_type',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'notes',
                        'is_private',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'notes',
                        'body',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'notes',
                        'title',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'notes',
                        'author_userId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'notes',
                        'caseId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'notes',
                        'organizationId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'appeal_drafts',
                        'submitted_at',
                        { transaction }
                    );
                
            
                
            
                
                    await queryInterface.removeColumn(
                        'appeal_drafts',
                        'content',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'appeal_drafts',
                        'status',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'appeal_drafts',
                        'title',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'appeal_drafts',
                        'author_userId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'appeal_drafts',
                        'caseId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'appeal_drafts',
                        'organizationId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'documents',
                        'received_at',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'documents',
                        'is_confidential',
                        { transaction }
                    );
                
            
                
            
                
                    await queryInterface.removeColumn(
                        'documents',
                        'description',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'documents',
                        'title',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'documents',
                        'category',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'documents',
                        'uploaded_by_userId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'documents',
                        'caseId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'documents',
                        'organizationId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'tasks',
                        'completed_at',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'tasks',
                        'due_at',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'tasks',
                        'priority',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'tasks',
                        'status',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'tasks',
                        'description',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'tasks',
                        'title',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'tasks',
                        'assignee_userId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'tasks',
                        'caseId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'tasks',
                        'organizationId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'outcome',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'closed_at',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'due_at',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'submitted_at',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'priority',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'status',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'amount_at_risk',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'ordering_provider',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'facility_name',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'denial_reason',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'denial_reason_code',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'diagnosis_code',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'procedure_code',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'member_id',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'patient_dob',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'patient_name',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'case_number',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'owner_userId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'payerId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'cases',
                        'organizationId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'is_active',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'appeals_contact',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'appeals_submission_method',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'portal_url',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'fax_number',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'claims_address',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'plan_type',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'payer_code',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'name',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'payers',
                        'organizationId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'organizations',
                        'name',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'permissions',
                        'name',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'roles',
                        'globalAccess',
                        { transaction }
                    );
                
            
                
            
                
                    await queryInterface.removeColumn(
                        'roles',
                        'role_customization',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'roles',
                        'name',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'organizationsId',
                        { transaction }
                    );
                
            
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'app_roleId',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'provider',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'passwordResetTokenExpiresAt',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'passwordResetToken',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'emailVerificationTokenExpiresAt',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'emailVerificationToken',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'emailVerified',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'password',
                        { transaction }
                    );
                
            
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'disabled',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'email',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'phoneNumber',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'lastName',
                        { transaction }
                    );
                
            
                
                    await queryInterface.removeColumn(
                        'users',
                        'firstName',
                        { transaction }
                    );
                
            
                
                    await queryInterface.dropTable('settings', { transaction });
                
            
                
                    await queryInterface.dropTable('activity_logs', { transaction });
                
            
                
                    await queryInterface.dropTable('notes', { transaction });
                
            
                
                    await queryInterface.dropTable('appeal_drafts', { transaction });
                
            
                
                    await queryInterface.dropTable('documents', { transaction });
                
            
                
                    await queryInterface.dropTable('tasks', { transaction });
                
            
                
                    await queryInterface.dropTable('cases', { transaction });
                
            
                
                    await queryInterface.dropTable('payers', { transaction });
                
            
                
                    await queryInterface.dropTable('organizations', { transaction });
                
            
                
                    await queryInterface.dropTable('permissions', { transaction });
                
            
                
                    await queryInterface.dropTable('roles', { transaction });
                
            
                
                    await queryInterface.dropTable('users', { transaction });
                
            
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
};
