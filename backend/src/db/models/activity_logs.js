module.exports = function(sequelize, DataTypes) {
  const activity_logs = sequelize.define(
    'activity_logs',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

entity_type: {
        type: DataTypes.ENUM,
      
      

        values: [

"case",


"task",


"document",


"appeal_draft",


"note",


"payer",


"user",


"setting"

        ],

      },

entity_key: {
        type: DataTypes.TEXT,
      
      

      },

action: {
        type: DataTypes.ENUM,
      
      

        values: [

"created",


"updated",


"assigned",


"status_changed",


"priority_changed",


"submitted",


"uploaded",


"commented",


"deleted",


"restored",


"login"

        ],

      },

actionType: { type: DataTypes.STRING },
      metadata: { type: DataTypes.JSONB },

      message: {
        type: DataTypes.TEXT,
      
      

      },

occurred_at: {
        type: DataTypes.DATE,
      
      

      },

ip_address: {
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

  activity_logs.associate = (db) => {


/// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity















//end loop



    db.activity_logs.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.activity_logs.belongsTo(db.cases, {
      as: 'case',
      foreignKey: {
        name: 'caseId',
      },
      constraints: false,
    });

    db.activity_logs.belongsTo(db.users, {
      as: 'actor_user',
      foreignKey: {
        name: 'actor_userId',
      },
      constraints: false,
    });




    db.activity_logs.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.activity_logs.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };



  return activity_logs;
};

