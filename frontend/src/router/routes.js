const routes = [
  {
    path: '/',
    component: () => import('src/layouts/MainLayout.vue'),
    redirect: { name: 'profiles' },
    children: [
      {
        name: 'profiles',
        path: '/profiles',
        component: () => import('src/pages/ProfilesPage.vue'),
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
