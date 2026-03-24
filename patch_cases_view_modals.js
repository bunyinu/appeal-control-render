const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/pages/cases/cases-view.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const imports = `
import CardBoxModal from "../../components/CardBoxModal";
import FormField from "../../components/FormField";
import { Field, Form, Formik } from "formik";
import axios from "axios";
`;

content = content.replace("import BaseButton from \"../../components/BaseButton\";", "import BaseButton from \"../../components/BaseButton\";" + imports);

const stateAndHandlers = `
    const [modalAction, setModalAction] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleActionSubmit = async (values) => {
        setActionLoading(true);
        try {
            if (modalAction === 'markWon') {
                await axios.put(\"/cases/\${id}/mark-won\", { data: { resolutionReason: values.reason } });
            } else if (modalAction === 'markLost') {
                await axios.put(\"/cases/\${id}/mark-lost\", { data: { resolutionReason: values.reason } });
            } else if (modalAction === 'reopen') {
                await axios.put(\"/cases/\${id}/reopen\", { data: { reopenReason: values.reason } });
            } else if (modalAction === 'changeStatus') {
                await axios.put(\"/cases/\${id}/change-status\", { data: { status: values.status } });
            }
            dispatch(fetchCase({ id }));
            setModalAction(null);
        } catch (e) {
            console.error(e);
            alert('Action failed: ' + (e.response?.data?.message || e.message));
        } finally {
            setActionLoading(false);
        }
    };
`;

content = content.replace(/const { id } = router.query;/, stateAndHandlers + '\n    const { id } = router.query;');

const newButtons = `
<BaseButton color="info" outline label="Change Status" onClick={() => setModalAction('changeStatus')} />
<BaseButton color="success" outline label="Add Task" href={'/tasks/tasks-new?caseId=' + id} />
<BaseButton color="warning" outline label="Add Note" href={'/notes/notes-new?caseId=' + id} />
<BaseButton color="info" outline label="Upload Document" href={'/documents/documents-new?caseId=' + id} />
<BaseButton color="info" outline label="New Draft" href={'/appeal_drafts/appeal_drafts-new?caseId=' + id} />
<BaseButton color="success" label="Mark Won" onClick={() => setModalAction('markWon')} />
<BaseButton color="danger" label="Mark Lost" onClick={() => setModalAction('markLost')} />
{['won', 'lost'].includes(cases.status) && <BaseButton color="warning" label="Reopen Case" onClick={() => setModalAction('reopen')} />}
`;

content = content.replace(/<BaseButton color="info" outline label="Change Status"[\s\S]*? dispatch\(fetchCase\(\{id\}\)\)\); \}\} \/>/, newButtons);

const modals = `
          <CardBoxModal
            isActive={!!modalAction}
            title={modalAction === 'markWon' ? 'Mark Case Won' : modalAction === 'markLost' ? 'Mark Case Lost' : modalAction === 'reopen' ? 'Reopen Case' : modalAction === 'changeStatus' ? 'Change Status' : ''}
            buttonColor={modalAction === 'markWon' ? 'success' : modalAction === 'markLost' ? 'danger' : 'info'}
            buttonLabel="Confirm"
            onCancel={() => setModalAction(null)}
            onConfirm={() => {
                const form = document.getElementById('action-form');
                if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
            }}
          >
            <Formik
              initialValues={{ reason: '', status: cases.status }}
              onSubmit={handleActionSubmit}
            >
              <Form id="action-form">
                {['markWon', 'markLost', 'reopen'].includes(modalAction) && (
                    <FormField label="Reason (Required)">
                      <Field name="reason" as="textarea" className="w-full border-gray-300 rounded p-2" rows="3" required />
                    </FormField>
                )}
                {modalAction === 'changeStatus' && (
                    <FormField label="New Status">
                      <Field name="status" as="select" className="w-full border-gray-300 rounded p-2">
                         <option value="intake">Intake</option>
                         <option value="triage">Triage</option>
                         <option value="evidence_needed">Evidence Needed</option>
                         <option value="appeal_ready">Appeal Ready</option>
                         <option value="submitted">Submitted</option>
                         <option value="pending_payer">Pending Payer</option>
                         <option value="won">Won</option>
                         <option value="lost">Lost</option>
                      </Field>
                    </FormField>
                )}
              </Form>
            </Formik>
          </CardBoxModal>
`;

content = content.replace(/<SectionMain>/, "<SectionMain>\n" + modals);

fs.writeFileSync(filePath, content);
console.log('Patched CasesView');
