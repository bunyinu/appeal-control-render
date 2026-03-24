module.exports = function(sequelize, DataTypes) {
  const cases = sequelize.define(
    'cases',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

case_number: {
        type: DataTypes.TEXT,
      
      

      },

patient_name: {
        type: DataTypes.TEXT,
      
      

      },

patient_dob: {
        type: DataTypes.DATE,
      
      

      },

member_id: {
        type: DataTypes.TEXT,
      
      

      },

procedure_code: {
        type: DataTypes.TEXT,
      
      

      },

diagnosis_code: {
        type: DataTypes.TEXT,
      
      

      },

denial_reason_code: {
        type: DataTypes.TEXT,
      
      

      },

denial_reason: {
        type: DataTypes.TEXT,
      
      

      },

facility_name: {
        type: DataTypes.TEXT,
      
      

      },

ordering_provider: {
        type: DataTypes.TEXT,
      
      

      },

amount_at_risk: {
        type: DataTypes.DECIMAL,
      
      

      },

status: {
        type: DataTypes.STRING,

      },

priority: {
        type: DataTypes.ENUM,
      
      

        values: [

"low",


"medium",


"high",


"urgent"

        ],

      },

submitted_at: {
        type: DataTypes.DATE,
      
      

      },

due_at: {
        type: DataTypes.DATE,
      
      

      },

closed_at: {
        type: DataTypes.DATE,
      
      

      },

outcome: {
        type: DataTypes.ENUM,
      
      

        values: [

"unknown",


"won",


"lost",


"partially_won",


"withdrawn"

        ],

      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  cases.associate = (db) => {


/// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity








    db.cases.hasMany(db.tasks, {
      as: 'tasks_case',
      foreignKey: {
          name: 'caseId',
      },
      constraints: false,
    });


    db.cases.hasMany(db.documents, {
      as: 'documents_case',
      foreignKey: {
          name: 'caseId',
      },
      constraints: false,
    });


    db.cases.hasMany(db.appeal_drafts, {
      as: 'appeal_drafts_case',
      foreignKey: {
          name: 'caseId',
      },
      constraints: false,
    });


    db.cases.hasMany(db.notes, {
      as: 'notes_case',
      foreignKey: {
          name: 'caseId',
      },
      constraints: false,
    });


    db.cases.hasMany(db.activity_logs, {
      as: 'activity_logs_case',
      foreignKey: {
          name: 'caseId',
      },
      constraints: false,
    });




//end loop



    db.cases.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.cases.belongsTo(db.payers, {
      as: 'payer',
      foreignKey: {
        name: 'payerId',
      },
      constraints: false,
    });

    db.cases.belongsTo(db.users, {
      as: 'owner_user',
      foreignKey: {
        name: 'owner_userId',
      },
      constraints: false,
    });




    db.cases.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.cases.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };



  return cases;
};

