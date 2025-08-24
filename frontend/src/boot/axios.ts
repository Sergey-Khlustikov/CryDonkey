import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { Notify } from 'quasar';
import { ERouteNames } from 'src/router/structures/route-names.enum.js';
import { defineBoot } from '#q-app/wrappers';

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

const api = axios.create({
  baseURL: '/api',
});

export default defineBoot(({ app, router }) => {
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
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
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
        await router.push({ name: ERouteNames.Login });
      }

      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      return Promise.reject(error);
    },
  );
});

export { api };
