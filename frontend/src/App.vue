<script setup>
import { useProfilesStore } from 'stores/useProfilesStore';
import { useProfileGroupsStore } from 'stores/useProfileGroupsStore';

defineOptions({
  name: 'App',
});

const profilesStore = useProfilesStore();
const profileGroupsStore = useProfileGroupsStore();

profilesStore.loadProfiles();
profileGroupsStore.loadGroups();
</script>

<template>
  <router-view/>
</template>
