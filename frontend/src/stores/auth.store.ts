import { acceptHMRUpdate, defineStore } from 'pinia';
import AuthController from 'src/domains/auth/controllers/auth.controller.js';
import { ERouteNames } from 'src/router/structures/route-names.enum.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
  }),

  getters: {
    isAuthenticated: ({ token }) => !!token,
  },

  actions: {
    async login(username: string, password: string) {
      const response = await AuthController.login(username, password);
      this.token = response.data.accessToken;
      localStorage.setItem('token', this.token);
    },

    async logout() {
      await AuthController.logout();
      this.token = '';
      localStorage.removeItem('token');

      await this.router.push({ name: ERouteNames.Login });
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
