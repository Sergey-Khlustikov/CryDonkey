import ROUTE_NAMES from 'src/router/structures/routeNames';

const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    redirect: {name: ROUTE_NAMES.profiles},
    children: [
      {
        name: ROUTE_NAMES.profiles,
        path: '/profile',
        component: () => import('src/pages/profiles/ProfilesPage.vue'),
      },
      {
        name: ROUTE_NAMES.jobs,
        path: '/jobs',
        component: () => import('src/pages/jobs/Jobs.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
