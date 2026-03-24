const fs = require('fs');

// Patch activity_logs.js
let activityLogs = fs.readFileSync('backend/src/db/models/activity_logs.js', 'utf8');
if (!activityLogs.includes('actionType')) {
  activityLogs = activityLogs.replace(
    'message: {',
    'actionType: { type: DataTypes.STRING },\n      metadata: { type: DataTypes.JSONB },\n\n      message: {'
  );
  fs.writeFileSync('backend/src/db/models/activity_logs.js', activityLogs);
}

// Patch appeal_drafts.js
let appealDrafts = fs.readFileSync('backend/src/db/models/appeal_drafts.js', 'utf8');
if (!appealDrafts.includes('version: {')) {
  appealDrafts = appealDrafts.replace(
    'title: {',
    'version: { type: DataTypes.INTEGER, defaultValue: 1 },\n      summary: { type: DataTypes.TEXT },\n      body: { type: DataTypes.TEXT },\n      evidenceChecklist: { type: DataTypes.JSONB },\n\n      title: {'
  );
  // Add belongsTo for submittedByUserId
  appealDrafts = appealDrafts.replace(
    'db.appeal_drafts.belongsTo(db.users, {',
    'db.appeal_drafts.belongsTo(db.users, {\n      as: \"submittedByUser\",\n      foreignKey: {\n        name: \"submittedByUserId\",\n      },\n      constraints: false,\n    });\n\n    db.appeal_drafts.belongsTo(db.users, {'
  );
  // Unescape literal backslashes so it's actual newlines
  appealDrafts = appealDrafts.replace(/\\n/g, '\n');
  
  // change status to STRING
  appealDrafts = appealDrafts.replace(
    /status: {\s*type: DataTypes\.ENUM,[\s\S]*?],/,
    'status: {\n        type: DataTypes.STRING,'
  );
  fs.writeFileSync('backend/src/db/models/appeal_drafts.js', appealDrafts);
}

// Patch cases.js for status type change
let cases = fs.readFileSync('backend/src/db/models/cases.js', 'utf8');
if (cases.includes('type: DataTypes.ENUM,')) {
    cases = cases.replace(
        /status: {\s*type: DataTypes\.ENUM,[\s\S]*?],/,
        'status: {\n        type: DataTypes.STRING,'
    );
    fs.writeFileSync('backend/src/db/models/cases.js', cases);
}