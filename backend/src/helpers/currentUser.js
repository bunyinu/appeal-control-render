function normalizeNullableValue(value) {
  return value === '' || value === undefined ? null : value;
}

function getCurrentUserOrganizationId(currentUser) {
  return normalizeNullableValue(
    (
      currentUser?.organizationId ||
      currentUser?.organizationsId ||
      currentUser?.organization?.id ||
      currentUser?.organizations?.id ||
      null
    ),
  );
}

function isAdminUser(currentUser) {
  const roleName = String(currentUser?.app_role?.name || '').toLowerCase();

  return Boolean(currentUser?.app_role?.globalAccess || roleName.includes('admin'));
}

function hasCrossOrganizationAccess(currentUser) {
  return isAdminUser(currentUser) || !getCurrentUserOrganizationId(currentUser);
}

function canAccessOrganization(currentUser, organizationId) {
  if (!organizationId) {
    return true;
  }

  return (
    hasCrossOrganizationAccess(currentUser) ||
    getCurrentUserOrganizationId(currentUser) === organizationId
  );
}

function resolveOrganizationIdForWrite(data, currentUser) {
  const currentUserOrganizationId = getCurrentUserOrganizationId(currentUser);
  const requestedOrganizationId = normalizeNullableValue(
    data?.organization ?? data?.organizationId,
  );

  if (hasCrossOrganizationAccess(currentUser)) {
    return requestedOrganizationId ?? currentUserOrganizationId ?? null;
  }

  return currentUserOrganizationId;
}

module.exports = {
  getCurrentUserOrganizationId,
  isAdminUser,
  hasCrossOrganizationAccess,
  canAccessOrganization,
  resolveOrganizationIdForWrite,
};
