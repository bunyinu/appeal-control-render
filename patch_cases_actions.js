const fs = require('fs');
const path = require('path');

const routesFile = path.join(__dirname, 'backend/src/routes/cases.js');
let routes = fs.readFileSync(routesFile, 'utf8');

const newRoutes = `
router.put('/:id/assign-owner', wrapAsync(async (req, res) => {
  const payload = await CasesService.assignOwner(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.put('/:id/change-status', wrapAsync(async (req, res) => {
  const payload = await CasesService.changeStatus(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.put('/:id/reopen', wrapAsync(async (req, res) => {
  const payload = await CasesService.reopen(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.put('/:id/mark-won', wrapAsync(async (req, res) => {
  const payload = await CasesService.markWon(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.put('/:id/mark-lost', wrapAsync(async (req, res) => {
  const payload = await CasesService.markLost(
    req.body.data,
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.use('/', require('../helpers').commonErrorHandler);
`;

routes = routes.replace(/router\.use\('/', require('../helpers').commonErrorHandler);/, newRoutes);
fs.writeFileSync(routesFile, routes);

const serviceFile = path.join(__dirname, 'backend/src/services/cases.js');
let service = fs.readFileSync(serviceFile, 'utf8');

const newMethods = `
  static async assignOwner(data, id, currentUser) {
    const record = await CasesDBApi.findBy(id, { currentUser });
    if (!record) throw new ValidationError('Case not found');
    
    const updated = await CasesDBApi.update(id, { assignedToUserId: data.assignedToUserId }, { currentUser });
    await Logger.log(currentUser.organizationId, id, currentUser.id, 'owner_changed', 'Owner assigned to ' + data.assignedToUserId, { assignedToUserId: data.assignedToUserId });
    return updated;
  }

  static async changeStatus(data, id, currentUser) {
    const record = await CasesDBApi.findBy(id, { currentUser });
    if (!record) throw new ValidationError('Case not found');
    
    // We reuse the update logic which has validation
    return await this.update({ status: data.status }, id, currentUser);
  }

  static async reopen(data, id, currentUser) {
    const record = await CasesDBApi.findBy(id, { currentUser });
    if (!record) throw new ValidationError('Case not found');
    
    if (!data.reopenReason) throw new ValidationError('reopenReasonRequired');
    
    const updated = await CasesDBApi.update(id, { status: data.status || 'intake' }, { currentUser });
    await Logger.log(currentUser.organizationId, id, currentUser.id, 'status_changed', 'Case reopened: ' + data.reopenReason, { reopenReason: data.reopenReason, status: data.status || 'intake' });
    return updated;
  }

  static async markWon(data, id, currentUser) {
    const record = await CasesDBApi.findBy(id, { currentUser });
    if (!record) throw new ValidationError('Case not found');
    
    if (!data.resolutionReason) throw new ValidationError('resolutionReasonRequired');
    
    const updated = await CasesDBApi.update(id, { status: 'won' }, { currentUser });
    await Logger.log(currentUser.organizationId, id, currentUser.id, 'status_changed', 'Case marked won: ' + data.resolutionReason, { resolutionReason: data.resolutionReason, status: 'won' });
    return updated;
  }

  static async markLost(data, id, currentUser) {
    const record = await CasesDBApi.findBy(id, { currentUser });
    if (!record) throw new ValidationError('Case not found');
    
    if (!data.resolutionReason) throw new ValidationError('resolutionReasonRequired');
    
    const updated = await CasesDBApi.update(id, { status: 'lost' }, { currentUser });
    await Logger.log(currentUser.organizationId, id, currentUser.id, 'status_changed', 'Case marked lost: ' + data.resolutionReason, { resolutionReason: data.resolutionReason, status: 'lost' });
    return updated;
  }
}
`;

service = service.replace(/}\nmodule.exports = CasesService;/, newMethods + '\nmodule.exports = CasesService;');
console.log('Patched Cases Routes and Services');
