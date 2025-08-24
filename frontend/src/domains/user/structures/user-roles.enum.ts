enum EUserRoles {
  Admin = 'admin',
  User = 'User',
}

export const USER_ROLES_SELECT_OPTIONS = [
  { value: EUserRoles.Admin, label: 'Admin' },
  { value: EUserRoles.User, label: 'User' },
];

export default EUserRoles;
