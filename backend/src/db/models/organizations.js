module.exports = function(sequelize, DataTypes) {
  const organizations = sequelize.define(
    'organizations',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

name: {
        type: DataTypes.TEXT,
      
      

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

  organizations.associate = (db) => {


/// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity


    db.organizations.hasMany(db.users, {
      as: 'users_organizations',
      foreignKey: {
          name: 'organizationsId',
      },
      constraints: false,
    });





    db.organizations.hasMany(db.payers, {
      as: 'payers_organization',
      foreignKey: {
          name: 'organizationId',
      },
      constraints: false,
    });


    db.organizations.hasMany(db.cases, {
      as: 'cases_organization',
      foreignKey: {
          name: 'organizationId',
      },
      constraints: false,
    });


    db.organizations.hasMany(db.tasks, {
      as: 'tasks_organization',
      foreignKey: {
          name: 'organizationId',
      },
      constraints: false,
    });


    db.organizations.hasMany(db.documents, {
      as: 'documents_organization',
      foreignKey: {
          name: 'organizationId',
      },
      constraints: false,
    });


    db.organizations.hasMany(db.appeal_drafts, {
      as: 'appeal_drafts_organization',
      foreignKey: {
          name: 'organizationId',
      },
      constraints: false,
    });


    db.organizations.hasMany(db.notes, {
      as: 'notes_organization',
      foreignKey: {
          name: 'organizationId',
      },
      constraints: false,
    });


    db.organizations.hasMany(db.activity_logs, {
      as: 'activity_logs_organization',
      foreignKey: {
          name: 'organizationId',
      },
      constraints: false,
    });


    db.organizations.hasMany(db.settings, {
      as: 'settings_organization',
      foreignKey: {
          name: 'organizationId',
      },
      constraints: false,
    });



//end loop






    db.organizations.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.organizations.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };



  return organizations;
};

