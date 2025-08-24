import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';
import AdsPowerController from 'src/domains/ads-power/controllers/ads-power.controller.js';
import type { IAdsPowerGroup } from 'src/domains/ads-power/structures/ads-power-group.interface.js';

export const useProfileGroupsStore = defineStore('profileGroups', () => {
  const groups = ref<IAdsPowerGroup[]>([]);

  const loadGroups = async () => {
    try {
      groups.value = await AdsPowerController.getGroups();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    groups,
    loadGroups,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfileGroupsStore, import.meta.hot));
}
