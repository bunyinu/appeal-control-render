const fs = require('fs');
const path = require('path');

const serviceFile = path.join(__dirname, 'backend/src/services/appeal_drafts.js');
let service = fs.readFileSync(serviceFile, 'utf8');

const newMethod = `
  static async submit(id, currentUser) {
    return await this.update({ status: 'submitted' }, id, currentUser);
  }
`;

service = service.replace(/}\s*module.exports = Appeal_draftsService;/, newMethod + '\n}\nmodule.exports = Appeal_draftsService;');
fs.writeFileSync(serviceFile, service);

const routesFile = path.join(__dirname, 'backend/src/routes/appeal_drafts.js');
let routes = fs.readFileSync(routesFile, 'utf8');

const newRoute = `
router.put('/:id/submit', wrapAsync(async (req, res) => {
  const payload = await Appeal_draftsService.submit(
    req.params.id,
    req.currentUser,
  );
  res.status(200).send(payload);
}));

router.use('/', require('../helpers').commonErrorHandler);
`;

routes = routes.replace("router.use('/', require('../helpers').commonErrorHandler);", newRoute);
fs.writeFileSync(routesFile, routes);
console.log('Patched Appeal Drafts submit action');
