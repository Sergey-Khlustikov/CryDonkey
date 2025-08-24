import type { RouteRecordRaw } from 'vue-router';
import { ERouteNames } from 'src/router/structures/route-names.enum.js';

const routes: RouteRecordRaw[] = [
  {
    name: ERouteNames.Login,
    path: '/login',
    component: () => import('src/pages/PageLogin.vue'),
  },

  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    redirect: { name: ERouteNames.Profiles },
    children: [
      {
        name: ERouteNames.Profiles,
        path: '/profiles',
        component: () => import('src/pages/profiles/PageProfiles.vue'),
      },
      {
        name: ERouteNames.Jobs,
        path: '/jobs',
        component: () => import('src/pages/jobs/PageJobs.vue'),
      },
      {
        name: ERouteNames.Users,
        path: '/users',
        component: () => import('src/pages/users/PageUsers.vue'),
      },
      {
        name: ERouteNames.UserSettings,
        path: '/user_settings',
        component: () => import('src/pages/user_settings/PageUserSettings.vue'),
      },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
