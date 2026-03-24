/* eslint-disable @typescript-eslint/no-var-requires */
const { test, expect } = require('@playwright/test');

const apiBaseUrl = process.env.E2E_API_URL || 'http://localhost:9000/api';
const adminCreds = {
  email: process.env.E2E_ADMIN_EMAIL || 'admin@flatlogic.com',
  password: process.env.E2E_ADMIN_PASSWORD || 'fcb45e0e',
};
const superAdminCreds = {
  email: process.env.E2E_SUPER_ADMIN_EMAIL || 'super_admin@flatlogic.com',
  password: process.env.E2E_SUPER_ADMIN_PASSWORD || 'fcb45e0e',
};
const clientCreds = {
  email: process.env.E2E_CLIENT_EMAIL || 'client@hello.com',
  password: process.env.E2E_CLIENT_PASSWORD || 'd0b1868750e0',
};
const routeMatrix = [
  { path: '/dashboard', heading: 'Operations Dashboard', probe: 'Operations and administration workspace' },
  { path: '/appeal-dashboard', heading: 'Appeal Dashboard', probe: 'Appeal operations summary' },
  { path: '/users/users-list', heading: 'Users' },
  { path: '/roles/roles-list', heading: 'Roles' },
  { path: '/permissions/permissions-list', heading: 'Permissions' },
  { path: '/organizations/organizations-list', heading: 'Organizations' },
  { path: '/payers/payers-list', heading: 'Payers' },
  { path: '/cases/cases-list', heading: 'Cases', probe: 'Case operations workspace' },
  { path: '/tasks/tasks-list', heading: 'Tasks', probe: 'Task operations workspace' },
  { path: '/documents/documents-list', heading: 'Documents' },
  { path: '/appeal_drafts/appeal_drafts-list', heading: 'Appeal Drafts' },
  { path: '/notes/notes-list', heading: 'Notes', probe: 'Case notes workspace' },
  { path: '/activity_logs/activity_logs-list', heading: 'Activity Logs' },
  { path: '/settings/settings-list', heading: 'Settings' },
  { path: '/profile', heading: 'Edit profile' },
];

const adminCreateFormRoutes = [
  { path: '/cases/cases-new', heading: 'New Case' },
  { path: '/tasks/tasks-new', heading: 'New Task' },
  { path: '/documents/documents-new', heading: 'New Document' },
  { path: '/appeal_drafts/appeal_drafts-new', heading: 'New Appeal Draft' },
  { path: '/notes/notes-new', heading: 'New Note' },
  { path: '/payers/payers-new', heading: 'New Payer' },
  { path: '/settings/settings-new', heading: 'New Setting' },
  { path: '/users/users-new', heading: 'New User' },
];

const detailMatrix = [
  {
    entity: 'cases',
    path: (record) => `/cases/cases-view/?id=${record.id}`,
    heading: /Case /i,
    expectedText: (record) => record.case_number || record.patient_name,
    probe: 'Move the case forward from the detail page without dropping back to the queue.',
  },
  {
    entity: 'tasks',
    path: (record) => `/tasks/tasks-view/?id=${record.id}`,
    heading: /Task Details/i,
    expectedText: (record) => record.title,
    probe: 'Supporting instructions or notes attached to the task.',
  },
  {
    entity: 'documents',
    path: (record) => `/documents/documents-view/?id=${record.id}`,
    heading: /Document Details/i,
    expectedText: (record) => record.title,
    probe: 'Attached files available for download.',
  },
  {
    entity: 'appeal_drafts',
    path: (record) => `/appeal_drafts/appeal_drafts-view/?id=${record.id}`,
    heading: /Appeal Draft Details/i,
    expectedText: (record) => record.title,
    probe: 'Rendered letter content stored for this draft.',
  },
  {
    entity: 'notes',
    path: (record) => `/notes/notes-view/?id=${record.id}`,
    heading: /Note Details/i,
    expectedText: (record) => record.title,
    probe: 'Full note content saved for this record.',
  },
  {
    entity: 'activity_logs',
    path: (record) => `/activity_logs/activity_logs-view/?id=${record.id}`,
    heading: /Activity Log Details/i,
    expectedText: (record) => record.message || record.entity_key || record.action,
    probe: 'Technical metadata captured for this activity.',
  },
  {
    entity: 'users',
    path: (record) => `/users/users-view/?id=${record.id}`,
    heading: /User Details/i,
    expectedText: (record) => record.email,
    probe: 'Core account and assignment information.',
  },
  {
    entity: 'settings',
    path: (record) => `/settings/settings-view/?id=${record.id}`,
    heading: /Setting Details/i,
    expectedText: (record) => record.key,
    probe: 'Current stored configuration value.',
  },
];

const listResources = [
  'cases',
  'tasks',
  'documents',
  'appeal_drafts',
  'notes',
  'activity_logs',
  'users',
  'settings',
];

let seedRecords = {};
let adminToken = '';
let superAdminToken = '';
let clientToken = '';

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function decodeJwtPayload(token) {
  const [, payload] = String(token).split('.');
  const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
}

async function signInViaApi(creds) {
  const response = await fetch(`${apiBaseUrl}/auth/signin/local`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(creds),
  });

  if (!response.ok) {
    throw new Error(`Failed to sign in ${creds.email} with status ${response.status}`);
  }

  return response.text();
}

async function fetchRows(token, resource, query = '?page=0&limit=100') {
  const response = await fetch(`${apiBaseUrl}/${resource}${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${resource} with status ${response.status}`);
  }

  const payload = await response.json();
  return Array.isArray(payload?.rows)
    ? payload.rows
    : Array.isArray(payload)
      ? payload
      : [];
}

async function fetchFirstRecord(token, resource) {
  const rows = await fetchRows(token, resource, '?page=0&limit=1');

  if (!rows.length) {
    throw new Error(`No records returned for ${resource}`);
  }

  return rows[0];
}

async function fetchRecord(token, resource, id) {
  const response = await fetch(`${apiBaseUrl}/${resource}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${resource}/${id} with status ${response.status}`);
  }

  return response.json();
}

async function createRecordViaApi(token, resource, data) {
  const response = await fetch(`${apiBaseUrl}/${resource}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create ${resource} with status ${response.status}`);
  }

  return response.json();
}

async function apiRequest(token, path, options = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  return response;
}

async function findRecordByField(token, resource, field, value) {
  for (const pageIndex of [0, 1, 2]) {
    const rows = await fetchRows(token, resource, `?page=${pageIndex}&limit=100`);
    const match = rows.find((row) => String(row?.[field] ?? '') === String(value));

    if (match) {
      return match;
    }

    if (rows.length < 100) {
      break;
    }
  }

  throw new Error(`Unable to find ${resource}.${field}=${value}`);
}

async function authenticateWithToken(page, token) {
  const decoded = decodeJwtPayload(token);

  await page.addInitScript(
    ({ storedToken, storedUser }) => {
      localStorage.setItem('token', storedToken);
      localStorage.setItem('user', JSON.stringify(storedUser));
    },
    {
      storedToken: token,
      storedUser: decoded,
    },
  );
}

async function openAuthenticatedPage(page, token, path = '/dashboard') {
  await authenticateWithToken(page, token);
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('domcontentloaded');
}

async function loginViaUi(page, creds = adminCreds) {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await page.locator('input[name="email"]').fill(creds.email);
  await page.locator('input[name="password"]').fill(creds.password);
  await Promise.all([
    page.waitForURL(/\/dashboard\/?$/),
    page.getByRole('button', { name: /^Login$/ }).click(),
  ]);
  await expect(page.getByRole('heading', { level: 1, name: /Operations Dashboard/i })).toBeVisible();
}

function trackPageErrors(page) {
  const pageErrors = [];
  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });
  return pageErrors;
}

async function fillInput(page, name, value) {
  await page.locator(`[name="${name}"]`).fill(value);
}

async function selectAsyncOption(page, fieldLabel, optionText) {
  const formField = page
    .locator('label', { hasText: new RegExp(`^${escapeRegex(fieldLabel)}$`, 'i') })
    .locator('xpath=..');

  const control = formField.locator('.react-select__control');
  await control.click();
  const option = page.locator('.react-select__option', { hasText: optionText }).first();

  try {
    await option.waitFor({ state: 'visible', timeout: 1500 });
  } catch (error) {
    await page.keyboard.type(optionText, { delay: 40 });
    await expect(option).toBeVisible({ timeout: 15000 });
  }

  await option.click();
  await expect(formField.locator('.react-select__single-value')).toContainText(optionText);
}

async function createRecordThroughUi({
  page,
  token,
  route,
  heading,
  redirectPattern,
  selects = [],
  fields,
  resource,
  keyField,
  keyValue,
  detailPath,
  verifyText,
}) {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();

  for (const select of selects) {
    await selectAsyncOption(page, select.label, select.option);
  }

  for (const [name, value] of Object.entries(fields)) {
    await fillInput(page, name, value);
  }

  await Promise.all([
    page.waitForURL(redirectPattern),
    page.getByRole('button', { name: /^Submit$/ }).click(),
  ]);

  const record = await findRecordByField(token, resource, keyField, keyValue);
  await page.goto(detailPath(record), { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(verifyText(record), { exact: false }).first()).toBeVisible();

  return record;
}

async function updateRecordThroughUi({
  page,
  token,
  route,
  heading,
  resource,
  id,
  fields = {},
  selects = [],
  detailPath,
  verifyText,
}) {
  await page.goto(route, { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();

  for (const select of selects) {
    await selectAsyncOption(page, select.label, select.option);
  }

  for (const [name, value] of Object.entries(fields)) {
    await fillInput(page, name, value);
  }

  await Promise.all([
    page.waitForResponse((response) => (
      response.url().includes(`/api/${resource}/${id}`) &&
      response.request().method() === 'PUT' &&
      response.status() === 200
    )),
    page.getByRole('button', { name: /^Submit$/ }).click(),
  ]);

  const record = await fetchRecord(token, resource, id);
  await page.goto(detailPath(record), { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(verifyText(record), { exact: false }).first()).toBeVisible();

  return record;
}

test.describe('Appeal Control E2E', () => {
  test.beforeAll(async () => {
    adminToken = await signInViaApi(adminCreds);
    superAdminToken = await signInViaApi(superAdminCreds);
    clientToken = await signInViaApi(clientCreds);

    const entries = await Promise.all(
      listResources.map(async (resource) => [resource, await fetchFirstRecord(adminToken, resource)]),
    );
    seedRecords = Object.fromEntries(entries);
  });

  test('authenticates through the login form', async ({ page }) => {
    const pageErrors = trackPageErrors(page);

    await loginViaUi(page);

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('loads major workspace routes and admin-accessible create forms', async ({ page }) => {
    test.slow();
    const pageErrors = trackPageErrors(page);

    await openAuthenticatedPage(page, adminToken);

    for (const route of routeMatrix) {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1, name: new RegExp(escapeRegex(route.heading), 'i') })).toBeVisible();
      if (route.probe) {
        await expect(page.getByText(route.probe, { exact: false })).toBeVisible();
      }
    }

    for (const route of adminCreateFormRoutes) {
      await page.goto(route.path, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1, name: new RegExp(escapeRegex(route.heading), 'i') })).toBeVisible();
    }

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('loads seeded detail pages for core workflow records', async ({ page }) => {
    test.slow();
    const pageErrors = trackPageErrors(page);

    await openAuthenticatedPage(page, adminToken);

    for (const detail of detailMatrix) {
      const record = seedRecords[detail.entity];
      await page.goto(detail.path(record), { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('heading', { level: 1, name: detail.heading })).toBeVisible();
      if (detail.expectedText(record)) {
        await expect(page.getByText(detail.expectedText(record), { exact: false }).first()).toBeVisible();
      }
      await expect(page.getByText(detail.probe, { exact: false }).first()).toBeVisible();
    }

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('searches by case number and drills into the case detail view', async ({ page }) => {
    const pageErrors = trackPageErrors(page);
    const caseRecord = seedRecords.cases;

    await openAuthenticatedPage(page, adminToken, '/search');
    await expect(page.getByRole('heading', { level: 1, name: /Search Workspace/i })).toBeVisible();
    await page.locator('input[name="query"]').fill(caseRecord.case_number);
    await Promise.all([
      page.waitForURL(new RegExp(`/search/?\\?query=${escapeRegex(caseRecord.case_number)}`)),
      page.getByRole('button', { name: /^Search$/ }).click(),
    ]);

    const resultLink = page.getByRole('link', { name: new RegExp(escapeRegex(caseRecord.case_number), 'i') }).first();
    await expect(resultLink).toBeVisible();
    await resultLink.click();
    await expect(page).toHaveURL(new RegExp(`/cases/cases-view/\\?id=${escapeRegex(caseRecord.id)}`));
    await expect(page.getByText('Case Actions')).toBeVisible();

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('renders the task calendar controls', async ({ page }) => {
    const pageErrors = trackPageErrors(page);

    await openAuthenticatedPage(page, adminToken, '/tasks/tasks-list');
    await expect(page.getByRole('heading', { level: 1, name: /Tasks/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Today$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Back$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Next$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Month$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Week$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Day$/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Agenda$/ })).toBeVisible();

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('creates workflow and operational records through the UI', async ({ page }) => {
    test.slow();
    const pageErrors = trackPageErrors(page);
    const suffix = Date.now();

    await openAuthenticatedPage(page, adminToken);

    const createdCase = await createRecordThroughUi({
      page,
      token: adminToken,
      route: '/cases/cases-new',
      heading: /New Case/i,
      redirectPattern: /\/cases\/cases-list\/?$/,
      selects: [
        { label: 'Organization', option: 'North Valley Oncology Group' },
      ],
      fields: {
        case_number: `E2E-UI-${suffix}`,
        patient_name: `E2E Patient ${suffix}`,
      },
      resource: 'cases',
      keyField: 'case_number',
      keyValue: `E2E-UI-${suffix}`,
      detailPath: (record) => `/cases/cases-view/?id=${record.id}`,
      verifyText: (record) => record.case_number,
    });

    await createRecordThroughUi({
      page,
      token: adminToken,
      route: `/tasks/tasks-new?caseId=${seedRecords.cases.id}`,
      heading: /New Task/i,
      redirectPattern: new RegExp(`/cases/cases-view/\\?id=${escapeRegex(seedRecords.cases.id)}`),
      fields: {
        title: `E2E UI Task ${suffix}`,
      },
      resource: 'tasks',
      keyField: 'title',
      keyValue: `E2E UI Task ${suffix}`,
      detailPath: (record) => `/tasks/tasks-view/?id=${record.id}`,
      verifyText: (record) => record.title,
    });

    await createRecordThroughUi({
      page,
      token: adminToken,
      route: `/notes/notes-new?caseId=${seedRecords.cases.id}`,
      heading: /New Note/i,
      redirectPattern: new RegExp(`/cases/cases-view/\\?id=${escapeRegex(seedRecords.cases.id)}`),
      fields: {
        title: `E2E UI Note ${suffix}`,
      },
      resource: 'notes',
      keyField: 'title',
      keyValue: `E2E UI Note ${suffix}`,
      detailPath: (record) => `/notes/notes-view/?id=${record.id}`,
      verifyText: (record) => record.title,
    });

    await createRecordThroughUi({
      page,
      token: adminToken,
      route: `/documents/documents-new?caseId=${seedRecords.cases.id}`,
      heading: /New Document/i,
      redirectPattern: new RegExp(`/cases/cases-view/\\?id=${escapeRegex(seedRecords.cases.id)}`),
      fields: {
        title: `E2E UI Document ${suffix}`,
      },
      resource: 'documents',
      keyField: 'title',
      keyValue: `E2E UI Document ${suffix}`,
      detailPath: (record) => `/documents/documents-view/?id=${record.id}`,
      verifyText: (record) => record.title,
    });

    await createRecordThroughUi({
      page,
      token: adminToken,
      route: `/appeal_drafts/appeal_drafts-new?caseId=${seedRecords.cases.id}`,
      heading: /New Appeal Draft/i,
      redirectPattern: new RegExp(`/cases/cases-view/\\?id=${escapeRegex(seedRecords.cases.id)}`),
      fields: {
        title: `E2E UI Draft ${suffix}`,
      },
      resource: 'appeal_drafts',
      keyField: 'title',
      keyValue: `E2E UI Draft ${suffix}`,
      detailPath: (record) => `/appeal_drafts/appeal_drafts-view/?id=${record.id}`,
      verifyText: (record) => record.title,
    });

    await createRecordThroughUi({
      page,
      token: adminToken,
      route: '/payers/payers-new',
      heading: /New Payer/i,
      redirectPattern: /\/payers\/payers-list\/?$/,
      selects: [
        { label: 'Organization', option: 'North Valley Oncology Group' },
      ],
      fields: {
        name: `E2E UI Payer ${suffix}`,
        payer_code: `U${String(suffix).slice(-4)}`,
      },
      resource: 'payers',
      keyField: 'name',
      keyValue: `E2E UI Payer ${suffix}`,
      detailPath: (record) => `/payers/payers-view/?id=${record.id}`,
      verifyText: (record) => record.name,
    });

    await createRecordThroughUi({
      page,
      token: adminToken,
      route: '/settings/settings-new',
      heading: /New Setting/i,
      redirectPattern: /\/settings\/settings-list\/?$/,
      selects: [
        { label: 'Organization', option: 'North Valley Oncology Group' },
      ],
      fields: {
        key: `e2e.ui.setting.${suffix}`,
      },
      resource: 'settings',
      keyField: 'key',
      keyValue: `e2e.ui.setting.${suffix}`,
      detailPath: (record) => `/settings/settings-view/?id=${record.id}`,
      verifyText: (record) => record.key,
    });

    await createRecordThroughUi({
      page,
      token: adminToken,
      route: '/users/users-new',
      heading: /New User/i,
      redirectPattern: /\/users\/users-list\/?$/,
      fields: {
        firstName: 'E2E',
        lastName: `User ${suffix}`,
        email: `e2e-ui-user-${suffix}@example.com`,
      },
      resource: 'users',
      keyField: 'email',
      keyValue: `e2e-ui-user-${suffix}@example.com`,
      detailPath: (record) => `/users/users-view/?id=${record.id}`,
      verifyText: (record) => record.email,
    });

    await page.goto(`/cases/cases-view/?id=${createdCase.id}`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(createdCase.case_number, { exact: false }).first()).toBeVisible();

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('creates super-administrator records through the UI', async ({ page }) => {
    test.slow();
    const pageErrors = trackPageErrors(page);
    const suffix = Date.now();

    await openAuthenticatedPage(page, superAdminToken);

    await createRecordThroughUi({
      page,
      token: superAdminToken,
      route: '/organizations/organizations-new',
      heading: /New Organization/i,
      redirectPattern: /\/organizations\/organizations-list\/?$/,
      fields: {
        name: `E2E UI Organization ${suffix}`,
      },
      resource: 'organizations',
      keyField: 'name',
      keyValue: `E2E UI Organization ${suffix}`,
      detailPath: (record) => `/organizations/organizations-view/?id=${record.id}`,
      verifyText: (record) => record.name,
    });

    await createRecordThroughUi({
      page,
      token: superAdminToken,
      route: '/permissions/permissions-new',
      heading: /New Permission/i,
      redirectPattern: /\/permissions\/permissions-list\/?$/,
      fields: {
        name: `E2E_UI_PERMISSION_${suffix}`,
      },
      resource: 'permissions',
      keyField: 'name',
      keyValue: `E2E_UI_PERMISSION_${suffix}`,
      detailPath: (record) => `/permissions/permissions-view/?id=${record.id}`,
      verifyText: (record) => record.name,
    });

    await createRecordThroughUi({
      page,
      token: superAdminToken,
      route: '/roles/roles-new',
      heading: /New Role/i,
      redirectPattern: /\/roles\/roles-list\/?$/,
      fields: {
        name: `E2E UI Role ${suffix}`,
      },
      resource: 'roles',
      keyField: 'name',
      keyValue: `E2E UI Role ${suffix}`,
      detailPath: (record) => `/roles/roles-view/?id=${record.id}`,
      verifyText: (record) => record.name,
    });

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('updates workflow and operational records through the UI', async ({ page }) => {
    test.slow();
    const pageErrors = trackPageErrors(page);
    const suffix = Date.now();
    const caseNumber = `E2E-EDIT-${suffix}`;
    const taskTitle = `E2E Edit Task ${suffix}`;
    const noteTitle = `E2E Edit Note ${suffix}`;
    const documentTitle = `E2E Edit Document ${suffix}`;
    const draftTitle = `E2E Edit Draft ${suffix}`;
    const payerName = `E2E Edit Payer ${suffix}`;
    const settingKey = `e2e.edit.setting.${suffix}`;
    const userEmail = `e2e-edit-user-${suffix}@example.com`;

    await createRecordViaApi(adminToken, 'cases', {
      organization: '785ef697-1e69-4546-8cb5-9f6c405a0888',
      case_number: caseNumber,
      patient_name: `E2E Edit Patient ${suffix}`,
    });
    const createdCase = await findRecordByField(adminToken, 'cases', 'case_number', caseNumber);

    await createRecordViaApi(adminToken, 'tasks', {
      case: createdCase.id,
      title: taskTitle,
    });
    const createdTask = await findRecordByField(adminToken, 'tasks', 'title', taskTitle);

    await createRecordViaApi(adminToken, 'notes', {
      case: createdCase.id,
      title: noteTitle,
    });
    const createdNote = await findRecordByField(adminToken, 'notes', 'title', noteTitle);

    await createRecordViaApi(adminToken, 'documents', {
      case: createdCase.id,
      title: documentTitle,
    });
    const createdDocument = await findRecordByField(adminToken, 'documents', 'title', documentTitle);

    await createRecordViaApi(adminToken, 'appeal_drafts', {
      case: createdCase.id,
      title: draftTitle,
    });
    const createdDraft = await findRecordByField(adminToken, 'appeal_drafts', 'title', draftTitle);

    await createRecordViaApi(adminToken, 'payers', {
      organization: '785ef697-1e69-4546-8cb5-9f6c405a0888',
      name: payerName,
      payer_code: `E${String(suffix).slice(-4)}`,
    });
    const createdPayer = await findRecordByField(adminToken, 'payers', 'name', payerName);

    await createRecordViaApi(adminToken, 'settings', {
      organization: '785ef697-1e69-4546-8cb5-9f6c405a0888',
      key: settingKey,
      value: 'initial',
    });
    const createdSetting = await findRecordByField(adminToken, 'settings', 'key', settingKey);

    await createRecordViaApi(adminToken, 'users', {
      email: userEmail,
      firstName: 'Edit',
      lastName: 'Target',
    });
    const createdUser = await findRecordByField(adminToken, 'users', 'email', userEmail);

    await openAuthenticatedPage(page, adminToken);

    await updateRecordThroughUi({
      page,
      token: adminToken,
      route: `/cases/cases-edit/?id=${createdCase.id}`,
      heading: /Edit Case/i,
      resource: 'cases',
      id: createdCase.id,
      fields: {
        case_number: `${caseNumber}-UPDATED`,
      },
      detailPath: (record) => `/cases/cases-view/?id=${record.id}`,
      verifyText: (record) => record.case_number,
    });

    await updateRecordThroughUi({
      page,
      token: adminToken,
      route: `/tasks/tasks-edit/?id=${createdTask.id}`,
      heading: /Edit Task/i,
      resource: 'tasks',
      id: createdTask.id,
      fields: {
        title: `${taskTitle} Updated`,
      },
      detailPath: (record) => `/tasks/tasks-view/?id=${record.id}`,
      verifyText: (record) => record.title,
    });

    await updateRecordThroughUi({
      page,
      token: adminToken,
      route: `/notes/notes-edit/?id=${createdNote.id}`,
      heading: /Edit Note/i,
      resource: 'notes',
      id: createdNote.id,
      fields: {
        title: `${noteTitle} Updated`,
      },
      detailPath: (record) => `/notes/notes-view/?id=${record.id}`,
      verifyText: (record) => record.title,
    });

    await updateRecordThroughUi({
      page,
      token: adminToken,
      route: `/documents/documents-edit/?id=${createdDocument.id}`,
      heading: /Edit Document/i,
      resource: 'documents',
      id: createdDocument.id,
      fields: {
        title: `${documentTitle} Updated`,
      },
      detailPath: (record) => `/documents/documents-view/?id=${record.id}`,
      verifyText: (record) => record.title,
    });

    await updateRecordThroughUi({
      page,
      token: adminToken,
      route: `/appeal_drafts/appeal_drafts-edit/?id=${createdDraft.id}`,
      heading: /Edit Appeal Draft/i,
      resource: 'appeal_drafts',
      id: createdDraft.id,
      fields: {
        title: `${draftTitle} Updated`,
      },
      detailPath: (record) => `/appeal_drafts/appeal_drafts-view/?id=${record.id}`,
      verifyText: (record) => record.title,
    });

    await updateRecordThroughUi({
      page,
      token: adminToken,
      route: `/payers/payers-edit/?id=${createdPayer.id}`,
      heading: /Edit Payer/i,
      resource: 'payers',
      id: createdPayer.id,
      fields: {
        name: `${payerName} Updated`,
      },
      detailPath: (record) => `/payers/payers-view/?id=${record.id}`,
      verifyText: (record) => record.name,
    });

    await updateRecordThroughUi({
      page,
      token: adminToken,
      route: `/settings/settings-edit/?id=${createdSetting.id}`,
      heading: /Edit Setting/i,
      resource: 'settings',
      id: createdSetting.id,
      fields: {
        key: `${settingKey}.updated`,
      },
      detailPath: (record) => `/settings/settings-view/?id=${record.id}`,
      verifyText: (record) => record.key,
    });

    await updateRecordThroughUi({
      page,
      token: adminToken,
      route: `/users/users-edit/?id=${createdUser.id}`,
      heading: /Edit User/i,
      resource: 'users',
      id: createdUser.id,
      fields: {
        firstName: 'Edited',
      },
      detailPath: (record) => `/users/users-view/?id=${record.id}`,
      verifyText: (record) => record.firstName,
    });

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('updates super-administrator records through the UI', async ({ page }) => {
    test.slow();
    const pageErrors = trackPageErrors(page);
    const suffix = Date.now();
    const organizationName = `E2E Edit Organization ${suffix}`;
    const permissionName = `E2E_EDIT_PERMISSION_${suffix}`;
    const roleName = `E2E Edit Role ${suffix}`;

    await createRecordViaApi(superAdminToken, 'organizations', {
      name: organizationName,
    });
    const createdOrganization = await findRecordByField(superAdminToken, 'organizations', 'name', organizationName);

    await createRecordViaApi(superAdminToken, 'permissions', {
      name: permissionName,
    });
    const createdPermission = await findRecordByField(superAdminToken, 'permissions', 'name', permissionName);

    await createRecordViaApi(superAdminToken, 'roles', {
      name: roleName,
    });
    const createdRole = await findRecordByField(superAdminToken, 'roles', 'name', roleName);

    await openAuthenticatedPage(page, superAdminToken);

    await updateRecordThroughUi({
      page,
      token: superAdminToken,
      route: `/organizations/organizations-edit/?id=${createdOrganization.id}`,
      heading: /Edit Organization/i,
      resource: 'organizations',
      id: createdOrganization.id,
      fields: {
        name: `${organizationName} Updated`,
      },
      detailPath: (record) => `/organizations/organizations-view/?id=${record.id}`,
      verifyText: (record) => record.name,
    });

    await updateRecordThroughUi({
      page,
      token: superAdminToken,
      route: `/permissions/permissions-edit/?id=${createdPermission.id}`,
      heading: /Edit Permission/i,
      resource: 'permissions',
      id: createdPermission.id,
      fields: {
        name: `${permissionName}_UPDATED`,
      },
      detailPath: (record) => `/permissions/permissions-view/?id=${record.id}`,
      verifyText: (record) => record.name,
    });

    await updateRecordThroughUi({
      page,
      token: superAdminToken,
      route: `/roles/roles-edit/?id=${createdRole.id}`,
      heading: /Edit Role/i,
      resource: 'roles',
      id: createdRole.id,
      fields: {
        name: `${roleName} Updated`,
      },
      detailPath: (record) => `/roles/roles-view/?id=${record.id}`,
      verifyText: (record) => record.name,
    });

    expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toEqual([]);
  });

  test('enforces permission boundaries for lower-privilege users', async () => {
    const settingsAttempt = await apiRequest(clientToken, '/settings', {
      method: 'POST',
      body: {
        data: {
          key: `blocked-setting-${Date.now()}`,
          value: 'blocked',
          value_type: 'string',
          is_sensitive: false,
        },
      },
    });

    const rolesAttempt = await apiRequest(clientToken, '/roles', {
      method: 'POST',
      body: {
        data: {
          name: `Blocked Role ${Date.now()}`,
        },
      },
    });

    expect([400, 401, 403]).toContain(settingsAttempt.status);
    expect([400, 401, 403]).toContain(rolesAttempt.status);
  });
});
