const fs = require('fs');

function patchService(serviceName, entityName, createAction, updateAction) {
  let code = fs.readFileSync(`backend/src/services/${serviceName}.js`, 'utf8');

  // Add Logger import
  if (!code.includes("const Logger = require('./logger');")) {
    code = code.replace("const config = require('../config');", "const config = require('../config');\nconst Logger = require('./logger');\n");
  }

  // Patch create
  let createMatch = new RegExp(`await ${entityName}DBApi.create([\s\S]*?);`);
  if (code.includes(`await ${entityName}DBApi.create(`)) {
    code = code.replace(`await ${entityName}DBApi.create(`, `const newEntity = await ${entityName}DBApi.create(`);
    let commitIndex = code.indexOf('await transaction.commit();');
    if (commitIndex > -1 && !code.includes(`actionType: '${createAction}'`)) {
      code = code.replace(
        'await transaction.commit();',
        `await transaction.commit();\n      if (newEntity.caseId) { await Logger.log({ organizationId: newEntity.organizationId, caseId: newEntity.caseId, actorUserId: currentUser.id, actionType: '${createAction}', message: '${createAction.replace('_', ' ')}' }); }`
      );
    }
  }

  // Patch update
  let updateMatch = new RegExp(`const updated${entityName} = await ${entityName}DBApi.update([\s\S]*?);`);
  if (code.includes(`const updated${entityName} = await ${entityName}DBApi.update(`) && !code.includes(`actionType: '${updateAction}'`)) {
    code = code.replace(
      'await transaction.commit();\n      return updated',
      `await transaction.commit();
      let dbEntity = await ${entityName}DBApi.findBy({id});
      if (dbEntity && dbEntity.caseId) {
         let act = '${updateAction}';
         if (data.status === 'completed' && dbEntity.status !== 'completed') act = '${entityName.toLowerCase()}_completed';
         await Logger.log({ organizationId: dbEntity.organizationId, caseId: dbEntity.caseId, actorUserId: currentUser.id, actionType: act, message: act.replace('_', ' ') });
      }
      return updated`
    );
  }

  fs.writeFileSync(`backend/src/services/${serviceName}.js`, code);
}

patchService('tasks', 'Tasks', 'task_created', 'task_updated');
patchService('notes', 'Notes', 'note_added', 'note_updated');
patchService('documents', 'Documents', 'document_uploaded', 'document_updated');

// Special logic for appeal_drafts: creating a new draft increments version, only one draft can be in submitted status per case.
