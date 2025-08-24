export const ERouteNames = {
  Profiles: 'Profiles',
  Jobs: 'Jobs',
  Login: 'Login',
  Users: 'Users',
  UserSettings: 'UserSettings',
} as const;

export type ERouteNames = typeof ERouteNames[keyof typeof ERouteNames];
