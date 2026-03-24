const fs = require('fs');
const path = require('path');

const routesFile = path.join(__dirname, 'backend/src/routes/activity_logs.js');
let routes = fs.readFileSync(routesFile, 'utf8');

routes = routes.replace(/router\.post\('\/', wrapAsync\(async \(req, res\) => \{[\s\S]*?\}\)\);/g, '');
routes = routes.replace(/router\.post\('\/bulk-import', wrapAsync\(async \(req, res\) => \{[\s\S]*?\}\)\);/g, '');
routes = routes.replace(/router\.put\('\/:id', wrapAsync\(async \(req, res\) => \{[\s\S]*?\}\)\);/g, '');
routes = routes.replace(/router\.delete\('\/:id', wrapAsync\(async \(req, res\) => \{[\s\S]*?\}\)\);/g, '');
routes = routes.replace(/router\.post\('\/deleteByIds', wrapAsync\(async \(req, res\) => \{[\s\S]*?\}\)\);/g, '');

fs.writeFileSync(routesFile, routes);

const serviceFile = path.join(__dirname, 'backend/src/services/activity_logs.js');
let service = fs.readFileSync(serviceFile, 'utf8');

service = service.replace(/static async create\([\s\S]*?static async update\(/, `static async create() { throw new Error('ActivityLogs are read-only'); }\n  static async bulkImport() { throw new Error('ActivityLogs are read-only'); }\n  static async update(`);
service = service.replace(/static async update\([\s\S]*?static async deleteByIds\(/, `static async update() { throw new Error('ActivityLogs are read-only'); }\n  static async deleteByIds(`);
service = service.replace(/static async deleteByIds\([\s\S]*?static async remove\(/, `static async deleteByIds() { throw new Error('ActivityLogs are read-only'); }\n  static async remove(`);
service = service.replace(/static async remove\([\s\S]*?}\n\s*module\.exports/, `static async remove() { throw new Error('ActivityLogs are read-only'); }\n}\nmodule.exports`);

fs.writeFileSync(serviceFile, service);
console.log('Patched ActivityLogs API and Service');
