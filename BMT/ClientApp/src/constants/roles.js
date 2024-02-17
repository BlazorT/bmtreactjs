import globalutil from 'src/util/globalutil';

export const roles = ['Select Role...', 'Admin', 'Supervisor', 'Super Admin', 'Public', 'User'];

export function getRoleById(id) {
  // Check if the index is within the valid range
  const role = globalutil.userroles().find((role) => role.id === id);
  return role ? role.name : '';
}
