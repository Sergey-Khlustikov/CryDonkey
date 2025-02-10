import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { Notify } from 'quasar';
import ROUTE_NAMES from 'src/router/structures/routeNames';

const api = axios.create({
  baseURL: '/api',
});

export default boot(({ app, router }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => {
      if (response.config.method === 'post' || response.config.method === 'delete') {
        Notify.create({
          type: 'positive',
          message: response.data.message || 'Success',
          position: 'top-right',
          progress: true,
          closeBtn: true,
        });
      }

      return response;
    },
    async (error) => {
      Notify.create({
        type: 'negative',
        message: error.message,
        caption: error.response?.data?.message,
        position: 'top-right',
        progress: true,
        closeBtn: true,
      });

      if (error.response?.status === 401) {
        await router.push({ name: ROUTE_NAMES.login });
      }

      return Promise.reject(error);
    },
  );
});

export { api };
