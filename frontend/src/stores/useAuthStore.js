import { defineStore } from 'pinia';
import AuthController from 'src/domains/auth/controllers/AuthController';
import ROUTE_NAMES from 'src/router/structures/routeNames';

export default defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isAuthenticated: ({ token }) => !!token,
  },

  actions: {
    async login(username, password) {
      const response = await AuthController.login(username, password);
      this.token = response.token;
      localStorage.setItem('token', this.token);
    },

    async logout() {
      await AuthController.logout();
      this.token = null;
      localStorage.removeItem('token');

      await this.router.push({ name: ROUTE_NAMES.login });
    },
  },
});
