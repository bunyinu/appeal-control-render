const fs = require('fs');
const path = require('path');

const serviceFile = path.join(__dirname, 'backend/src/services/cases.js');
let service = fs.readFileSync(serviceFile, 'utf8');

const newMethods = `
  static async assignOwner(data, id, currentUser) {
    if (!data.assignedToUserId) throw new ValidationError('assignedToUserIdRequired');
    return await this.update({ owner_userId: data.assignedToUserId }, id, currentUser);
  }

  static async changeStatus(data, id, currentUser) {
    if (!data.status) throw new ValidationError('statusRequired');
    return await this.update({ status: data.status }, id, currentUser);
  }

  static async reopen(data, id, currentUser) {
    if (!data.reopenReason) throw new ValidationError('reopenReasonRequired', 'A reason is required to reopen a case');
    return await this.update({ status: data.status || 'intake', reopenReason: data.reopenReason }, id, currentUser);
  }

  static async markWon(data, id, currentUser) {
    if (!data.resolutionReason) throw new ValidationError('resolutionReasonRequired', 'A reason is required to mark as won');
    // We can also set outcome to won here
    return await this.update({ status: 'won', outcome: 'won', resolutionReason: data.resolutionReason }, id, currentUser);
  }

  static async markLost(data, id, currentUser) {
    if (!data.resolutionReason) throw new ValidationError('resolutionReasonRequired', 'A reason is required to mark as lost');
    // We can also set outcome to lost here
    return await this.update({ status: 'lost', outcome: 'lost', resolutionReason: data.resolutionReason }, id, currentUser);
  }
`;

service = service.replace(/}\nmodule\.exports = CasesService;/, newMethods + '\n}\nmodule.exports = CasesService;');
// Wait, the update method should also log the resolutionReason.
service = service.replace(/metadata: \{ oldStatus, newStatus, reopenReason: data\.reopenReason \}/, 'metadata: { oldStatus, newStatus, reopenReason: data.reopenReason, resolutionReason: data.resolutionReason }');

fs.writeFileSync(serviceFile, service);
console.log('Patched CasesService');
