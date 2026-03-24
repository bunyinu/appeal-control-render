module.exports = function(sequelize, DataTypes) {
  const appeal_drafts = sequelize.define(
    'appeal_drafts',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

version: { type: DataTypes.INTEGER, defaultValue: 1 },
      summary: { type: DataTypes.TEXT },
      body: { type: DataTypes.TEXT },
      evidenceChecklist: { type: DataTypes.JSONB },

      title: {
        type: DataTypes.TEXT,
      
      

      },

status: {
        type: DataTypes.STRING,

      },

content: {
        type: DataTypes.TEXT,
      
      

      },

submitted_at: {
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

  appeal_drafts.associate = (db) => {


/// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity















//end loop



    db.appeal_drafts.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.appeal_drafts.belongsTo(db.cases, {
      as: 'case',
      foreignKey: {
        name: 'caseId',
      },
      constraints: false,
    });

    db.appeal_drafts.belongsTo(db.users, {
      as: "submittedByUser",
      foreignKey: {
        name: "submittedByUserId",
      },
      constraints: false,
    });

    db.appeal_drafts.belongsTo(db.users, {
      as: 'author_user',
      foreignKey: {
        name: 'author_userId',
      },
      constraints: false,
    });



    db.appeal_drafts.hasMany(db.file, {
      as: 'attachments',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.appeal_drafts.getTableName(),
        belongsToColumn: 'attachments',
      },
    });


    db.appeal_drafts.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.appeal_drafts.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };



  return appeal_drafts;
};

