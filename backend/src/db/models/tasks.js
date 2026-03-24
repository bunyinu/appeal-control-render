module.exports = function(sequelize, DataTypes) {
  const tasks = sequelize.define(
    'tasks',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

title: {
        type: DataTypes.TEXT,
      
      

      },

description: {
        type: DataTypes.TEXT,
      
      

      },

status: {
        type: DataTypes.ENUM,
      
      

        values: [

"todo",


"in_progress",


"blocked",


"done"

        ],

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

due_at: {
        type: DataTypes.DATE,
      
      

      },

completed_at: {
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

  tasks.associate = (db) => {


/// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity















//end loop



    db.tasks.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.tasks.belongsTo(db.cases, {
      as: 'case',
      foreignKey: {
        name: 'caseId',
      },
      constraints: false,
    });

    db.tasks.belongsTo(db.users, {
      as: 'assignee_user',
      foreignKey: {
        name: 'assignee_userId',
      },
      constraints: false,
    });




    db.tasks.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.tasks.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };



  return tasks;
};

