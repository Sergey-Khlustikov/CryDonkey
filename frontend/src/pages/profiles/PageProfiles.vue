<script setup>
import useProfilesStore from 'src/stores/useProfilesStore';
import ProfilesTable from 'src/pages/profiles/components/ProfilesTable.vue';
import ProfileGroupsSelect from 'src/pages/profiles/components/ProfileGroupsSelect.vue';
import { computed, ref } from 'vue';
import JobQueuesDropdown from 'src/pages/profiles/components/JobQueuesDropdown.vue';
import useProfileGroupsStore from 'src/stores/useProfileGroupsStore';

defineOptions({
  name: 'ProfilesPage',
});

const profilesStore = useProfilesStore();
const profileGroupsStore = useProfileGroupsStore();

profilesStore.loadProfiles();
profileGroupsStore.loadGroups();

const selectedProfiles = ref([]);
const selectedGroup = ref();

const filteredProfiles = computed(() => {
  if (!selectedGroup.value || !selectedGroup.value.value) {
    return profilesStore.profiles;
  }

  return profilesStore.profiles.filter(profile => profile.group_id === selectedGroup.value.value);
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
