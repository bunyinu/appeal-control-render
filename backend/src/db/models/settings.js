module.exports = function(sequelize, DataTypes) {
  const settings = sequelize.define(
    'settings',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

key: {
        type: DataTypes.TEXT,
      
      

      },

value: {
        type: DataTypes.TEXT,
      
      

      },

description: {
        type: DataTypes.TEXT,
      
      

      },

value_type: {
        type: DataTypes.ENUM,
      
      

        values: [

"string",


"number",


"boolean",


"json"

        ],

      },

is_sensitive: {
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

  settings.associate = (db) => {


/// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity















//end loop



    db.settings.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });




    db.settings.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.settings.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };



  return settings;
};

