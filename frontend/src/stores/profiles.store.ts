import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';
import AdsPowerController from 'src/domains/ads-power/controllers/ads-power.controller.js';
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';

export const useProfilesStore = defineStore('profiles', () => {
  const profiles = ref<IAdsPowerProfile[]>([]);

  const loadProfiles = async () => {
    try {
      profiles.value = await AdsPowerController.getProfiles();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    profiles,
    loadProfiles,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useProfilesStore, import.meta.hot));
}
