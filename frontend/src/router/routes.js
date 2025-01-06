import ROUTE_NAMES from 'src/router/structures/routeNames';

const routes = [
  {
    name: ROUTE_NAMES.login,
    path: '/login',
    component: () => import('src/pages/PageLogin.vue'),
  },

  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    redirect: { name: ROUTE_NAMES.profiles },
    children: [
      {
        name: ROUTE_NAMES.profiles,
        path: '/profiles',
        component: () => import('src/pages/profiles/PageProfiles.vue'),
      },
      {
        name: ROUTE_NAMES.jobs,
        path: '/jobs',
        component: () => import('src/pages/jobs/PageJobs.vue'),
      },
      {
        name: ROUTE_NAMES.users,
        path: '/users',
        component: () => import('src/pages/users/PageUsers.vue'),
      },
      {
        name: ROUTE_NAMES.userSettings,
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
