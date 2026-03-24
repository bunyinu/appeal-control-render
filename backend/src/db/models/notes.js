module.exports = function(sequelize, DataTypes) {
  const notes = sequelize.define(
    'notes',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

title: {
        type: DataTypes.TEXT,
      
      

      },

body: {
        type: DataTypes.TEXT,
      
      

      },

is_private: {
        type: DataTypes.BOOLEAN,
      
        allowNull: false,
        defaultValue: false,
      
      

      },

note_type: {
        type: DataTypes.ENUM,
      
      

        values: [

"general",


"payer_call",


"clinical_review",


"submission",


"follow_up",


"outcome"

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

  notes.associate = (db) => {


/// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity















//end loop



    db.notes.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.notes.belongsTo(db.cases, {
      as: 'case',
      foreignKey: {
        name: 'caseId',
      },
      constraints: false,
    });

    db.notes.belongsTo(db.users, {
      as: 'author_user',
      foreignKey: {
        name: 'author_userId',
      },
      constraints: false,
    });




    db.notes.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.notes.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };



  return notes;
};

