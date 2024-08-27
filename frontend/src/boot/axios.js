import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { Notify } from 'quasar';

const api = axios.create({ baseURL: `http://localhost:${process.env.VUE_APP_SERVER_PORT}` });

api.interceptors.response.use(
  (response) => {
    if (response.config.method === 'post' || response.config.method === 'delete') {
      Notify.create({
        type: 'positive',
        message: response.data.message,
        position: 'top-right',
        progress: true,
        closeBtn: true,
      });
    }

    return response;
  },
  (error) => {
    Notify.create({
      type: 'negative',
      message: error.message,
      caption: error.response?.data?.message,
      position: 'top-right',
      progress: true,
      closeBtn: true,
    });

    return Promise.reject(error);
  },
);

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
