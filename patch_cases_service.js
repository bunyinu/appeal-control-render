const fs = require('fs');

let casesSvc = fs.readFileSync('backend/src/services/cases.js', 'utf8');

// Add Logger import
if (!casesSvc.includes("const Logger = require('./logger');")) {
  casesSvc = casesSvc.replace("const config = require('../config');", "const config = require('../config');\nconst Logger = require('./logger');\n");
}

// Patch create
if (casesSvc.includes('await CasesDBApi.create(')) {
  casesSvc = casesSvc.replace(
    'await CasesDBApi.create(',
    'const newCase = await CasesDBApi.create('
  );
  casesSvc = casesSvc.replace(
    'await transaction.commit();',
    `await transaction.commit();\n      await Logger.log({\n        organizationId: newCase.organizationId,\n        caseId: newCase.id,\n        actorUserId: currentUser.id,\n        actionType: 'case_created',\n        message: 'Case was created',\n        metadata: { case_number: newCase.case_number }\n      });`
  );
}

// Patch update
const updateCode = `
      let cases = await CasesDBApi\.findBy\({id}, {transaction});
      if (!cases) { throw new ValidationError('casesNotFound'); }

      const oldStatus = cases.status;
      const newStatus = data.status || cases.status;
      
      if (data.status && data.status !== oldStatus) {
        const allowedTransitions = {
          'intake': ['triage'],
          'triage': ['evidence_needed', 'appeal_ready'],
          'evidence_needed': ['appeal_ready'],
          'appeal_ready': ['submitted'],
          'submitted': ['pending_payer'],
          'pending_payer': ['won', 'lost']
        };

        const isReopening = (['won', 'lost'].includes(oldStatus)) && !['won', 'lost'].includes(newStatus);
        
        if (isReopening) {
          if (!data.reopenReason) {
            throw new ValidationError('reopenReasonRequired', 'A reason is required to reopen a case');
          }
        } else if (allowedTransitions[oldStatus] && !allowedTransitions[oldStatus].includes(newStatus)) {
            // reject invalid transition
            throw new ValidationError('invalidStatusTransition', 'Cannot transition case status from ' + oldStatus + ' to ' + newStatus);
        }
      }

      const updatedCases = await CasesDBApi.update(id, data, { currentUser, transaction });
      await transaction.commit();

      // Logging
      if (data.status && data.status !== oldStatus) {
        await Logger.log({
          organizationId: cases.organizationId,
          caseId: id,
          actorUserId: currentUser.id,
          actionType: 'status_changed',
          message: 'Status changed from ' + oldStatus + ' to ' + newStatus,
          metadata: { oldStatus, newStatus, reopenReason: data.reopenReason }
        });
      }
      if (data.owner_userId && data.owner_userId !== cases.owner_userId) {
        await Logger.log({
          organizationId: cases.organizationId,
          caseId: id,
          actorUserId: currentUser.id,
          actionType: 'owner_changed',
          message: 'Case owner was changed',
          metadata: { oldOwner: cases.owner_userId, newOwner: data.owner_userId }
        });
      }
      if (data.due_at && new Date(data.due_at).getTime() !== new Date(cases.due_at).getTime()) {
        await Logger.log({
          organizationId: cases.organizationId,
          caseId: id,
          actorUserId: currentUser.id,
          actionType: 'due_date_changed',
          message: 'Case due date was changed',
          metadata: { oldDueDate: cases.due_at, newDueDate: data.due_at }
        });
      }
      if (!data.status && !data.owner_userId && !data.due_at) {
        await Logger.log({
          organizationId: cases.organizationId,
          caseId: id,
          actorUserId: currentUser.id,
          actionType: 'case_updated',
          message: 'Case details were updated',
          metadata: { updatedFields: Object.keys(data) }
        });
      }

      return updatedCases;
`;

casesSvc = casesSvc.replace(/let cases = await CasesDBApi\.findBy\([\s\S]*?return updatedCases;/m, updateCode);

fs.writeFileSync('backend/src/services/cases.js', casesSvc);