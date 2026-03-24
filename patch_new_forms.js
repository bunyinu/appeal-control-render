const fs = require('fs');

const entities = ['tasks', 'documents', 'appeal_drafts', 'notes', 'activity_logs'];

for (const e of entities) {
  const file = `frontend/src/pages/${e}/${e}-new.tsx`;
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(
    new RegExp(`await router\.push\('/${e}/${e}-list'\)`),
    `await router.push(router.query.caseId ? `/cases/cases-view?id=${router.query.caseId}` : '/${e}/${e}-list')`
  );

  content = content.replace(
    /initialValues={[^]*?}[\s\S]*?onSubmit=/, 
    `initialValues={{ ...(typeof dateRangeStart !== 'undefined' && dateRangeStart && dateRangeEnd ? { ...initialValues, due_at: moment(dateRangeStart).format('YYYY-MM-DDTHH:mm'), completed_at: moment(dateRangeEnd).format('YYYY-MM-DDTHH:mm') } : initialValues), case: router.query.caseId || '' }}
          onSubmit=`
  );
  
  fs.writeFileSync(file, content);
}
