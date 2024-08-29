import { defineStore } from 'pinia';
import { ref } from 'vue';
import AdsController from 'src/domains/ads/AdsController';

export default defineStore('profileGroups', () => {
  const groups = ref([]);

  const loadGroups = async () => {
    try {
      groups.value = await AdsController.getGroups();
    } catch (e) {
      console.log(e);
    }
  };

  return {
    groups,
    loadGroups,
  };
});
