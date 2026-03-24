
const ValidationError = require('../services/notifications/errors/validation');
const RolesDBApi = require('../db/api/roles');

// Cache for the 'Public' role object
let publicRoleCache = null;

// Function to asynchronously fetch and cache the 'Public' role
async function fetchAndCachePublicRole() {
    try {
        // Use RolesDBApi to find the role by name 'Public'
        publicRoleCache = await RolesDBApi.findBy({ name: 'Public' });

        if (!publicRoleCache) {
            console.error("WARNING: Role 'Public' not found in database during middleware startup. Check your migrations.");
        }
    } catch (error) {
        console.error("Error fetching 'Public' role during middleware startup:", error);
        // Handle the error during startup fetch
        throw error; // Important to know if the app can proceed without the Public role
    }
}

// Trigger the role fetching when the check-permissions.js module is imported/loaded
// This should happen during application startup when routes are being configured.
fetchAndCachePublicRole().catch(error => {
    // Handle the case where the fetchAndCachePublicRole promise is rejected
    console.error("Critical error during permissions middleware initialization:", error);
    // Decide here if the process should exit if the Public role is essential.
    // process.exit(1);
});

/**
 * Middleware creator to check if the current user (or Public role) has a specific permission.
 * @param {string} permission - The name of the required permission.
 * @return {import("express").RequestHandler} Express middleware function.
 */
function checkPermissions(permission) {
    return async (req, res, next) => {
        const { currentUser } = req;

        // 1. Check self-access bypass (only if the user is authenticated)
        if (currentUser && (currentUser.id === req.params.id || currentUser.id === req.body.id)) {
            return next(); // User has access to their own resource
        }

        // 2. Check Custom Permissions (only if the user is authenticated)
        if (currentUser) {
            // Ensure custom_permissions is an array before using find
            const customPermissions = Array.isArray(currentUser.custom_permissions)
                ? currentUser.custom_permissions
                : [];
            const userPermission = customPermissions.find(
                (cp) => cp.name === permission,
            );
            if (userPermission) {
                return next(); // User has a custom permission
            }
        }

        // 3. Determine the "effective" role for permission check
        let effectiveRole = null;
        try {
            if (currentUser && currentUser.app_role) {
                // User is authenticated and has an assigned role
                effectiveRole = currentUser.app_role;
            } else {
                // User is NOT authenticated OR is authenticated but has no role
                // Use the cached 'Public' role
                if (!publicRoleCache) {
                    // If the cache is unexpectedly empty (e.g., startup error caught),
                    // we can try fetching the role again synchronously (less ideal) or just deny access.
                    // Less efficient fallback option:
                    effectiveRole = await RolesDBApi.findBy({ name: 'Public' }); // Could be slow
                    if (!effectiveRole) {
                        // If even the synchronous attempt failed
                        return next(new Error("Internal Server Error: Public role missing and cannot be fetched."));
                    }
                } else {
                    effectiveRole = publicRoleCache; // Use the cached object
                }
            }

            // Check if we got a valid role object
            if (!effectiveRole) {
                return next(new Error("Internal Server Error: Could not determine effective role."));
            }

            // 4. Check Permissions on the "effective" role
            // Assume the effectiveRole object (from app_role or RolesDBApi) has a getPermissions() method
            // or a 'permissions' property (if permissions are eagerly loaded).
            let rolePermissions = [];
            if (typeof effectiveRole.getPermissions === 'function') {
                rolePermissions = await effectiveRole.getPermissions(); // Get permissions asynchronously if the method exists
            } else if (Array.isArray(effectiveRole.permissions)) {
                rolePermissions = effectiveRole.permissions; // Or take from property if permissions are pre-loaded
            } else {
                console.error("Role object lacks getPermissions() method or permissions property:", effectiveRole);
                return next(new Error("Internal Server Error: Invalid role object format."));
            }


            if (rolePermissions.find((p) => p.name === permission)) {
                next(); // The "effective" role has the required permission
            } else {
                // The "effective" role does not have the required permission
                const roleName = effectiveRole.name || 'unknown role';
                next(new ValidationError('auth.forbidden', `Role '${roleName}' denied access to '${permission}'.`));
            }

        } catch (e) {
            // Handle errors during role or permission fetching
            console.error("Error during permission check:", e);
            next(e); // Pass the error to the next middleware
        }
    };
}

const METHOD_MAP = {
  POST: 'CREATE',
  GET: 'READ',
  PUT: 'UPDATE',
  PATCH: 'UPDATE',
  DELETE: 'DELETE',
};

/**
 * Middleware creator to check standard CRUD permissions based on HTTP method and entity name.
 * @param {string} name - The name of the entity.
 * @return {import("express").RequestHandler} Express middleware function.
 */
function checkCrudPermissions(name) {
    return (req, res, next) => {
        // Dynamically determine the permission name (e.g., 'READ_USERS')
        const permissionName = `${METHOD_MAP[req.method]}_${name.toUpperCase()}`;
        // Call the checkPermissions middleware with the determined permission
        checkPermissions(permissionName)(req, res, next);
    };
}

module.exports = {
    checkPermissions,
    checkCrudPermissions,
};
