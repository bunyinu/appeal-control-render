const fs = require('fs');

let view = fs.readFileSync('frontend/src/pages/cases/cases-view.tsx', 'utf8');

if (!view.includes('updateCase')) {
    view = view.replace("import { fetch as fetchCase } from '../../stores/cases/casesSlice';", "import { fetch as fetchCase, update as updateCase } from '../../stores/cases/casesSlice';");
}

let commandArea = [
    "{activeTab === 'overview' && (",
    "<CardBox className=\"mb-6\">",
    "<h3 className=\"text-xl font-semibold mb-4\">Command Actions</h3>",
    "<div className=\"flex flex-wrap gap-2\">",
    "<BaseButton color=\"info\" outline label=\"Assign Owner\" href={'/cases/cases-edit/?id=' + id} />",
    "<BaseButton color=\"info\" outline label=\"Change Status\" href={'/cases/cases-edit/?id=' + id} />",
    "<BaseButton color=\"success\" outline label=\"Add Task\" href={'/tasks/tasks-new?caseId=' + id} />",
    "<BaseButton color=\"warning\" outline label=\"Add Note\" href={'/notes/notes-new?caseId=' + id} />",
    "<BaseButton color=\"info\" outline label=\"Upload Document\" href={'/documents/documents-new?caseId=' + id} />",
    "<BaseButton color=\"info\" outline label=\"New Draft\" href={'/appeal_drafts/appeal_drafts-new?caseId=' + id} />",
    "<BaseButton color=\"success\" label=\"Mark Won\" onClick={() => { const reason = prompt('Enter reason (optional)'); dispatch(updateCase({ id, data: { status: 'won', reopenReason: reason }})).then(() => dispatch(fetchCase({id}))); }} />",
    "<BaseButton color=\"danger\" label=\"Mark Lost\" onClick={() => { const reason = prompt('Enter reason (optional)'); dispatch(updateCase({ id, data: { status: 'lost', reopenReason: reason }})).then(() => dispatch(fetchCase({id}))); }} />",
    "</div>",
    "</CardBox>",
    ")}"
].join('\n');

if (!view.includes('Command Actions')) {
    view = view.replace("{activeTab === 'overview' && (", commandArea + "\n            {activeTab === 'overview' && (");
}

fs.writeFileSync('frontend/src/pages/cases/cases-view.tsx', view);
