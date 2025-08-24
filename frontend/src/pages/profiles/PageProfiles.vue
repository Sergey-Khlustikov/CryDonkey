<script setup lang="ts">
import { useProfilesStore } from 'stores/profiles.store.js';
import ProfilesTable from 'src/pages/profiles/components/ProfilesTable.vue';
import ProfileGroupsSelect from 'src/pages/profiles/components/ProfileGroupsSelect.vue';
import { computed, onBeforeMount, ref } from 'vue';
import JobQueuesDropdown from 'src/pages/profiles/components/JobQueuesDropdown.vue';
import { useProfileGroupsStore } from 'stores/profile-groups.store.js';

defineOptions({
  name: 'ProfilesPage',
});

const profilesStore = useProfilesStore();
const profileGroupsStore = useProfileGroupsStore();

onBeforeMount(async () => {
  await profilesStore.loadProfiles();
  await profileGroupsStore.loadGroups();
});

const selectedProfiles = ref([]);
const selectedGroup = ref();

const filteredProfiles = computed(() => {
  if (!selectedGroup.value || !selectedGroup.value.value) {
    return profilesStore.profiles;
  }

  return profilesStore.profiles.filter((profile) => profile.group_id === selectedGroup.value.value);
});
</script>

<template>
  <q-page padding>
    <div class="filters flex justify-between q-mb-md">
      <profile-groups-select v-model="selectedGroup" style="width: 300px"></profile-groups-select>
      <job-queues-dropdown :profiles="selectedProfiles"></job-queues-dropdown>
    </div>

    <profiles-table v-model="selectedProfiles" :profiles="filteredProfiles"></profiles-table>
  </q-page>
</template>
