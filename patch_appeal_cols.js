const fs = require('fs');
let code = fs.readFileSync('frontend/src/components/Appeal_drafts/configureAppeal_draftsCols.tsx', 'utf8');

// Replace getActions to include Submit button
code = code.replace(
  'return [',
  `return [\n                   params.row.status !== 'submitted' ? <GridActionsCellItem\n                     key="submit"\n                     icon={<BaseIcon path={mdiEye} size="18" />}\n                     label="Submit"\n                     onClick={async () => {\n                        if (window.confirm('Submit this draft?')) {\n                          await axios.put('/appeal_drafts/' + params.row.id, { id: params.row.id, data: { status: 'submitted' } });\n                          window.location.reload();\n                        }\n                     }}\n                     showInMenu\n                   /> : <div key="ph"></div>,`
);

fs.writeFileSync('frontend/src/components/Appeal_drafts/configureAppeal_draftsCols.tsx', code);
