const db = require('../db/models');
const { redactSensitiveData } = require('../helpers/security');

class Logger {
  static getOrganizationId(currentUser) {
    return (
      currentUser?.organizationId ||
      currentUser?.organizationsId ||
      currentUser?.organization?.id ||
      currentUser?.organizations?.id ||
      null
    );
  }

  static resolveAction(actionType, fallbackAction) {
    if (fallbackAction) {
      return fallbackAction;
    }

    if (!actionType) {
      return 'updated';
    }

    const normalized = String(actionType).toLowerCase();

    if (normalized.includes('login')) return 'login';
    if (normalized.includes('created') || normalized.includes('added')) return 'created';
    if (normalized.includes('uploaded')) return 'uploaded';
    if (normalized.includes('submitted')) return 'submitted';
    if (normalized.includes('assigned')) return 'assigned';
    if (normalized.includes('priority')) return 'priority_changed';
    if (normalized.includes('status')) return 'status_changed';
    if (normalized.includes('deleted') || normalized.includes('removed')) return 'deleted';
    return 'updated';
  }

  static normalizeEntityType(entityType, fallbackCaseId) {
    if (!entityType && fallbackCaseId) {
      return 'case';
    }

    if (!entityType) {
      return 'user';
    }

    return String(entityType).replace(/s$/, '');
  }

  static normalizePayload(args) {
    if (args.length === 1 && typeof args[0] === 'object' && !Array.isArray(args[0])) {
      const payload = args[0];
      return {
        organizationId: payload.organizationId || null,
        caseId: payload.caseId || null,
        actorUserId: payload.actorUserId || null,
        entityType: this.normalizeEntityType(payload.entityType, payload.caseId),
        entityKey: payload.entityKey || payload.caseId || payload.actorUserId || null,
        action: this.resolveAction(payload.actionType, payload.action),
        actionType: payload.actionType || null,
        message: payload.message || 'activity logged',
        metadata: redactSensitiveData(payload.metadata || {}),
        occurredAt: payload.occurredAt || new Date(),
        ipAddress: payload.ipAddress || null,
      };
    }

    const [currentUser, entityType, entityKey, message, metadata = {}] = args;
    return {
      organizationId: this.getOrganizationId(currentUser),
      caseId: entityType === 'case' || entityType === 'cases' ? entityKey : null,
      actorUserId: currentUser?.id || null,
      entityType: this.normalizeEntityType(entityType),
      entityKey,
      action: this.resolveAction(metadata?.actionType, metadata?.action),
      actionType: metadata?.actionType || null,
      message,
      metadata: redactSensitiveData(metadata),
      occurredAt: new Date(),
      ipAddress: metadata?.ipAddress || null,
    };
  }

  static async log(...args) {
    const payload = this.normalizePayload(args);

    try {
      await db.activity_logs.create({
        organizationId: payload.organizationId,
        caseId: payload.caseId,
        actor_userId: payload.actorUserId,
        entity_type: payload.entityType,
        entity_key: payload.entityKey,
        action: payload.action,
        actionType: payload.actionType,
        message: payload.message,
        metadata: payload.metadata,
        occurred_at: payload.occurredAt,
        ip_address: payload.ipAddress,
      });
    } catch (error) {
      console.error('Failed to log activity', redactSensitiveData(error));
    }
  }
}

module.exports = Logger;
module.exports.Logger = Logger;
