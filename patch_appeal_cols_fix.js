const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/components/Appeal_drafts/configureAppeal_draftsCols.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The original buggy code from line 28 is:
// if (!hasPermission(user, 'READ_' + entityName.toUpperCase())) return [
//                    params.row.status !== 'submitted' ? <GridActionsCellItem
//                      key="submit"
//                      icon={<BaseIcon path={mdiEye} size="18" />}
//                      label="Submit"
//                      onClick={async () => {
//                         if (window.confirm('Submit this draft?')) {
//                           await axios.put('/appeal_drafts/' + params.row.id, { id: params.row.id, data: { status: 'submitted' } });
//                           window.location.reload();
//                         }
//                      }}
//                      showInMenu
//                    /> : <div key="ph"></div>,];

const searchStr = `if (!hasPermission(user, 'READ_' + entityName.toUpperCase())) return [
                   params.row.status !== 'submitted' ? <GridActionsCellItem
                     key="submit"
                     icon={<BaseIcon path={mdiEye} size="18" />}
                     label="Submit"
                     onClick={async () => {
                        if (window.confirm('Submit this draft?')) {
                          await axios.put('/appeal_drafts/' + params.row.id, { id: params.row.id, data: { status: 'submitted' } });
                          window.location.reload();
                        }
                     }}
                     showInMenu
                   /> : <div key="ph"></div>,];`;

content = content.replace(searchStr, "if (!hasPermission(user, 'READ_' + entityName.toUpperCase())) return [];");

const actionsRegex = /return [\s]*<div key={params?.row?.id}>[\s]*<ListActionsPopover[\s\S]*?/>[\s]*<\/div>,[\s]*]/;
const newActions = `
               const actions = [
                   <div key={params?.row?.id}>
                      <ListActionsPopover
                      onDelete={onDelete}
                      itemId={params?.row?.id}
                      pathEdit={\`/appeal_drafts/appeal_drafts-edit/?id=${params?.row?.id}\`}
                      pathView={\`/appeal_drafts/appeal_drafts-view/?id=${params?.row?.id}\`}
                      
                      hasUpdatePermission={hasUpdatePermission}
                      
                    />
                   </div>,
               ];
               if (params.row.status !== 'submitted') {
                   actions.push(
                     <GridActionsCellItem
                       key="submit"
                       icon={<BaseIcon path={mdiEye} size="18" />}
                       label="Submit"
                       onClick={async () => {
                          const conf = window.confirm('Submit this draft?');
                          if (conf) {
                            try {
                                await axios.put('/appeal_drafts/' + params.row.id + '/submit');
                                window.location.reload();
                            } catch (e) {
                                alert('Error submitting: ' + (e.response?.data?.message || e.message));
                            }
                          }
                       }}
                       showInMenu
                     />
                   );
               }
               return actions;
`;

content = content.replace(actionsRegex, newActions);
fs.writeFileSync(filePath, content);
console.log('Fixed configureAppeal_draftsCols.tsx');
