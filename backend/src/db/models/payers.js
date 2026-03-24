module.exports = function(sequelize, DataTypes) {
  const payers = sequelize.define(
    'payers',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

name: {
        type: DataTypes.TEXT,
      
      

      },

payer_code: {
        type: DataTypes.TEXT,
      
      

      },

plan_type: {
        type: DataTypes.TEXT,
      
      

      },

claims_address: {
        type: DataTypes.TEXT,
      
      

      },

fax_number: {
        type: DataTypes.TEXT,
      
      

      },

portal_url: {
        type: DataTypes.TEXT,
      
      

      },

appeals_submission_method: {
        type: DataTypes.TEXT,
      
      

      },

appeals_contact: {
        type: DataTypes.TEXT,
      
      

      },

is_active: {
        type: DataTypes.BOOLEAN,
      
        allowNull: false,
        defaultValue: false,
      
      

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

  payers.associate = (db) => {


/// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity







    db.payers.hasMany(db.cases, {
      as: 'cases_payer',
      foreignKey: {
          name: 'payerId',
      },
      constraints: false,
    });









//end loop



    db.payers.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });




    db.payers.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.payers.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };



  return payers;
};

