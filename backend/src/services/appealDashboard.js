const db = require('../db/models');

const { Op, fn, col } = db.Sequelize;

const ACTIVE_CASE_STATUSES = [
  'intake',
  'triage',
  'evidence_needed',
  'appeal_ready',
  'submitted',
  'pending_payer',
];

const SUBMITTED_CASE_STATUSES = ['submitted', 'pending_payer'];
const CASE_STATUS_ORDER = [
  'intake',
  'triage',
  'evidence_needed',
  'appeal_ready',
  'submitted',
  'pending_payer',
  'won',
  'lost',
];
const TASK_STATUS_ORDER = ['todo', 'in_progress', 'blocked', 'done'];
const PRIORITY_WEIGHT = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function getOrganizationId(currentUser) {
  return (
    currentUser?.organizations?.id ||
    currentUser?.organization?.id ||
    currentUser?.organizationsId ||
    null
  );
}

function getScopedWhere(currentUser) {
  if (currentUser?.app_role?.globalAccess) {
    return {};
  }

  return {
    organizationId: getOrganizationId(currentUser),
  };
}

function toNumber(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return 0;
  }

  return numericValue;
}

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function endOfDaysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(23, 59, 59, 999);
  return date;
}

function compareNullableDatesAsc(left, right) {
  if (!left && !right) {
    return 0;
  }

  if (!left) {
    return 1;
  }

  if (!right) {
    return -1;
  }

  return new Date(left).getTime() - new Date(right).getTime();
}

function humanName(user) {
  if (!user) {
    return null;
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

  return fullName || user.email || null;
}

function normalizeGroupedResults(items, keyOrder, keyName, extraNumericKey) {
  const byKey = new Map(
    items.map((item) => [
      item[keyName],
      {
        [keyName]: item[keyName],
        count: toNumber(item.count),
        ...(extraNumericKey ? { [extraNumericKey]: toNumber(item[extraNumericKey]) } : {}),
      },
    ]),
  );

  const orderedItems = keyOrder
    .filter((key) => byKey.has(key))
    .map((key) => byKey.get(key));

  const unorderedItems = items
    .filter((item) => !keyOrder.includes(item[keyName]))
    .map((item) => ({
      [keyName]: item[keyName],
      count: toNumber(item.count),
      ...(extraNumericKey ? { [extraNumericKey]: toNumber(item[extraNumericKey]) } : {}),
    }))
    .sort((left, right) => right.count - left.count);

  return [...orderedItems, ...unorderedItems];
}

module.exports = class AppealDashboardService {
  static async getSummary(currentUser) {
    const now = new Date();
    const today = startOfToday();
    const nextSevenDays = endOfDaysFromNow(7);
    const scopedWhere = getScopedWhere(currentUser);
    const activeCaseWhere = {
      ...scopedWhere,
      status: {
        [Op.in]: ACTIVE_CASE_STATUSES,
      },
    };
    const openTaskWhere = {
      ...scopedWhere,
      status: {
        [Op.not]: 'done',
      },
    };

    const [
      totalCases,
      activeCases,
      overdueCases,
      dueThisWeekCases,
      submittedCases,
      readyCases,
      evidenceNeededCases,
      urgentCases,
      blockedTasks,
      dueSoonTaskCount,
      totalDocuments,
      draftAppeals,
      amountAtRiskRow,
      statusBreakdownRows,
      priorityBreakdownRows,
      taskBreakdownRows,
      highPriorityCaseRows,
      dueSoonTaskRows,
      recentActivityRows,
      recentDraftRows,
    ] = await Promise.all([
      db.cases.count({ where: scopedWhere }),
      db.cases.count({ where: activeCaseWhere }),
      db.cases.count({
        where: {
          ...activeCaseWhere,
          due_at: {
            [Op.lt]: now,
          },
        },
      }),
      db.cases.count({
        where: {
          ...activeCaseWhere,
          due_at: {
            [Op.gte]: today,
            [Op.lte]: nextSevenDays,
          },
        },
      }),
      db.cases.count({
        where: {
          ...scopedWhere,
          status: {
            [Op.in]: SUBMITTED_CASE_STATUSES,
          },
        },
      }),
      db.cases.count({
        where: {
          ...scopedWhere,
          status: 'appeal_ready',
        },
      }),
      db.cases.count({
        where: {
          ...scopedWhere,
          status: 'evidence_needed',
        },
      }),
      db.cases.count({
        where: {
          ...activeCaseWhere,
          priority: {
            [Op.in]: ['urgent', 'high'],
          },
        },
      }),
      db.tasks.count({
        where: {
          ...scopedWhere,
          status: 'blocked',
        },
      }),
      db.tasks.count({
        where: {
          ...openTaskWhere,
          due_at: {
            [Op.gte]: today,
            [Op.lte]: nextSevenDays,
          },
        },
      }),
      db.documents.count({ where: scopedWhere }),
      db.appeal_drafts.count({
        where: {
          ...scopedWhere,
          status: {
            [Op.in]: ['draft', 'in_review'],
          },
        },
      }),
      db.cases.findOne({
        attributes: [[fn('COALESCE', fn('SUM', col('amount_at_risk')), 0), 'amountAtRisk']],
        where: activeCaseWhere,
        raw: true,
      }),
      db.cases.findAll({
        attributes: [
          'status',
          [fn('COUNT', col('id')), 'count'],
          [fn('COALESCE', fn('SUM', col('amount_at_risk')), 0), 'amountAtRisk'],
        ],
        where: scopedWhere,
        group: ['status'],
        raw: true,
      }),
      db.cases.findAll({
        attributes: ['priority', [fn('COUNT', col('id')), 'count']],
        where: scopedWhere,
        group: ['priority'],
        raw: true,
      }),
      db.tasks.findAll({
        attributes: ['status', [fn('COUNT', col('id')), 'count']],
        where: scopedWhere,
        group: ['status'],
        raw: true,
      }),
      db.cases.findAll({
        where: activeCaseWhere,
        attributes: [
          'id',
          'case_number',
          'patient_name',
          'status',
          'priority',
          'due_at',
          'amount_at_risk',
          'updatedAt',
        ],
        include: [
          {
            model: db.payers,
            as: 'payer',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: db.users,
            as: 'owner_user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            required: false,
          },
        ],
        order: [['updatedAt', 'DESC']],
        limit: 24,
      }),
      db.tasks.findAll({
        where: openTaskWhere,
        attributes: ['id', 'title', 'status', 'priority', 'due_at', 'updatedAt'],
        include: [
          {
            model: db.cases,
            as: 'case',
            attributes: ['id', 'case_number', 'patient_name', 'status', 'priority'],
            required: false,
          },
          {
            model: db.users,
            as: 'assignee_user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            required: false,
          },
        ],
        order: [['updatedAt', 'DESC']],
        limit: 24,
      }),
      db.activity_logs.findAll({
        where: scopedWhere,
        attributes: [
          'id',
          'entity_type',
          'entity_key',
          'action',
          'message',
          'metadata',
          'occurred_at',
          'createdAt',
        ],
        include: [
          {
            model: db.users,
            as: 'actor_user',
            attributes: ['id', 'firstName', 'lastName', 'email'],
            required: false,
          },
          {
            model: db.cases,
            as: 'case',
            attributes: ['id', 'case_number', 'patient_name'],
            required: false,
          },
        ],
        order: [['createdAt', 'DESC']],
        limit: 8,
      }),
      db.appeal_drafts.findAll({
        where: scopedWhere,
        attributes: ['id', 'title', 'status', 'summary', 'updatedAt'],
        include: [
          {
            model: db.cases,
            as: 'case',
            attributes: ['id', 'case_number', 'patient_name'],
            required: false,
          },
        ],
        order: [['updatedAt', 'DESC']],
        limit: 6,
      }),
    ]);

    const highPriorityCases = highPriorityCaseRows
      .map((record) => record.get({ plain: true }))
      .sort((left, right) => {
        const priorityDifference =
          (PRIORITY_WEIGHT[right.priority] || 0) - (PRIORITY_WEIGHT[left.priority] || 0);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        const dueDateDifference = compareNullableDatesAsc(left.due_at, right.due_at);

        if (dueDateDifference !== 0) {
          return dueDateDifference;
        }

        return toNumber(right.amount_at_risk) - toNumber(left.amount_at_risk);
      })
      .slice(0, 6)
      .map((record) => ({
        id: record.id,
        caseNumber: record.case_number,
        patientName: record.patient_name,
        status: record.status,
        priority: record.priority,
        dueAt: record.due_at,
        amountAtRisk: toNumber(record.amount_at_risk),
        payerName: record.payer?.name || null,
        ownerName: humanName(record.owner_user),
      }));

    const dueSoonTasks = dueSoonTaskRows
      .map((record) => record.get({ plain: true }))
      .sort((left, right) => {
        const dueDateDifference = compareNullableDatesAsc(left.due_at, right.due_at);

        if (dueDateDifference !== 0) {
          return dueDateDifference;
        }

        return (PRIORITY_WEIGHT[right.priority] || 0) - (PRIORITY_WEIGHT[left.priority] || 0);
      })
      .slice(0, 6)
      .map((record) => ({
        id: record.id,
        title: record.title,
        status: record.status,
        priority: record.priority,
        dueAt: record.due_at,
        caseId: record.case?.id || null,
        caseNumber: record.case?.case_number || null,
        patientName: record.case?.patient_name || null,
        assigneeName: humanName(record.assignee_user),
      }));

    const recentActivity = recentActivityRows.map((record) => {
      const plainRecord = record.get({ plain: true });

      return {
        id: plainRecord.id,
        entityType: plainRecord.entity_type,
        entityKey: plainRecord.entity_key,
        action: plainRecord.action,
        message: plainRecord.message,
        metadata: plainRecord.metadata || null,
        occurredAt: plainRecord.occurred_at || plainRecord.createdAt,
        actorName: humanName(plainRecord.actor_user),
        caseId: plainRecord.case?.id || null,
        caseNumber: plainRecord.case?.case_number || null,
        patientName: plainRecord.case?.patient_name || null,
      };
    });

    const recentDrafts = recentDraftRows.map((record) => {
      const plainRecord = record.get({ plain: true });

      return {
        id: plainRecord.id,
        title: plainRecord.title,
        status: plainRecord.status,
        summary: plainRecord.summary,
        updatedAt: plainRecord.updatedAt,
        caseId: plainRecord.case?.id || null,
        caseNumber: plainRecord.case?.case_number || null,
        patientName: plainRecord.case?.patient_name || null,
      };
    });

    return {
      generatedAt: now.toISOString(),
      scope: {
        organizationId: getOrganizationId(currentUser),
        organizationName: currentUser?.organizations?.name || 'All organizations',
        globalAccess: !!currentUser?.app_role?.globalAccess,
      },
      metrics: {
        totalCases,
        activeCases,
        overdueCases,
        dueThisWeekCases,
        submittedCases,
        readyCases,
        evidenceNeededCases,
        urgentCases,
        blockedTasks,
        dueSoonTasks: dueSoonTaskCount,
        totalDocuments,
        draftAppeals,
        amountAtRisk: toNumber(amountAtRiskRow?.amountAtRisk),
      },
      statusBreakdown: normalizeGroupedResults(
        statusBreakdownRows,
        CASE_STATUS_ORDER,
        'status',
        'amountAtRisk',
      ),
      priorityBreakdown: normalizeGroupedResults(
        priorityBreakdownRows,
        ['urgent', 'high', 'medium', 'low'],
        'priority',
      ),
      taskBreakdown: normalizeGroupedResults(taskBreakdownRows, TASK_STATUS_ORDER, 'status'),
      highPriorityCases,
      dueSoonTaskQueue: dueSoonTasks,
      recentActivity,
      recentDrafts,
    };
  }
};
