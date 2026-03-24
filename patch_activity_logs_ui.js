const fs = require('fs');

const listPath = 'frontend/src/pages/activity_logs/activity_logs-list.tsx';
let list = fs.readFileSync(listPath, 'utf8');
// Remove "New" button
list = list.replace(/<BaseButton[^>]*href={['`"]\/activity_logs\/(activity_logs-)?new['`"]}[^>]*>[\s\S]*?<\/BaseButton>/g, '');
fs.writeFileSync(listPath, list);

const tablePath = 'frontend/src/pages/activity_logs/activity_logs-table.tsx';
let table = fs.readFileSync(tablePath, 'utf8');
// Remove delete logic from table
table = table.replace(/const handleDelete =[^;]*;/g, '');
table = table.replace(/dispatch\(doDelete\([^)]+\)\)/g, '');

// Simplify action buttons to just View
table = table.replace(
  /<BaseButtons>(?:(?!<\/BaseButtons>)[\s\S])*<\/BaseButtons>/,
  '<BaseButtons>\n          <BaseButton color="info" icon={mdiEye} href={`/activity_logs/${row.id}`} small title="View" />\n        </BaseButtons>'
);
fs.writeFileSync(tablePath, table);

