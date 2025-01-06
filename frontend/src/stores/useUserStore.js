import { defineStore } from 'pinia';
import UserController from 'src/domains/user/controllers/UserController';
import USER_ROLES from 'src/domains/user/structures/userRoles';

export default defineStore('user', {
  state: () => ({
    user: {},
  }),

  getters: {
    username: ({ user }) => user.username,
    isAdmin: ({ user }) => user.role === USER_ROLES.admin,
  },

  actions: {
    async loadUser() {
      this.user = await UserController.me();
    },
  },
});
