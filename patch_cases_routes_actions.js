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

routes = routes.replace(/router\.use\('\/', require\('\.\.\/helpers'\)\.commonErrorHandler\);/, newRoutes);
fs.writeFileSync(routesFile, routes);
console.log('Patched Cases routes');
