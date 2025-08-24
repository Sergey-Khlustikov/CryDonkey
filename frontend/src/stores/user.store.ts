import { acceptHMRUpdate, defineStore } from 'pinia';
import UserController from 'src/domains/user/controllers/user.controller.js';
import type { IUser } from 'src/domains/user/structures/user.interface.js';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as IUser | null,
  }),

  getters: {
    username: (state): string | null => state.user?.username ?? null,
  },

  actions: {
    async loadUser(): Promise<void> {
      this.user = await UserController.me();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
