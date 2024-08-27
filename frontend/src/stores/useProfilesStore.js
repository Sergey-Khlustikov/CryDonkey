import { defineStore } from 'pinia';
import { ref } from 'vue';
import AdsController from 'src/domains/ads/AdsController';

export default defineStore('profiles', () => {
  const profiles = ref([]);

  const loadProfiles = async () => {
    try {
      profiles.value = await AdsController.getProfiles();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    profiles,
    loadProfiles,
  };
});
