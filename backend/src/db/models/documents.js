module.exports = function(sequelize, DataTypes) {
  const documents = sequelize.define(
    'documents',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

category: {
        type: DataTypes.ENUM,
      
      

        values: [

"denial_letter",


"medical_records",


"clinical_notes",


"imaging",


"treatment_plan",


"letter_of_medical_necessity",


"policy",


"authorization",


"claim",


"correspondence",


"other"

        ],

      },

title: {
        type: DataTypes.TEXT,
      
      

      },

description: {
        type: DataTypes.TEXT,
      
      

      },

is_confidential: {
        type: DataTypes.BOOLEAN,
      
        allowNull: false,
        defaultValue: false,
      
      

      },

received_at: {
        type: DataTypes.DATE,
      
      

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

  documents.associate = (db) => {


/// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity















//end loop



    db.documents.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.documents.belongsTo(db.cases, {
      as: 'case',
      foreignKey: {
        name: 'caseId',
      },
      constraints: false,
    });

    db.documents.belongsTo(db.users, {
      as: 'uploaded_by_user',
      foreignKey: {
        name: 'uploaded_by_userId',
      },
      constraints: false,
    });



    db.documents.hasMany(db.file, {
      as: 'file',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.documents.getTableName(),
        belongsToColumn: 'file',
      },
    });


    db.documents.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.documents.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };



  return documents;
};

