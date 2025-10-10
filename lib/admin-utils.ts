// Admin role checking utilities

export const ADMIN_ROLES = ['admin', 'moderator'] as const;

export type AdminRole = typeof ADMIN_ROLES[number];

/**
 * Check if user has admin access
 */
export const isAdmin = (userRole: string | undefined): boolean => {
  return ADMIN_ROLES.includes(userRole as AdminRole);
};

/**
 * Check if user has admin access from user object
 */
export const isUserAdmin = (user: any): boolean => {
  return user && isAdmin(user.role);
};

/**
 * Get admin role display name
 */
export const getAdminRoleDisplayName = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'moderator':
      return 'Moderatör';
    default:
      return 'Kullanıcı';
  }
};

/**
 * Decode JWT token to get user role (client-side only)
 */
export const getUserRoleFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || null;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
};
