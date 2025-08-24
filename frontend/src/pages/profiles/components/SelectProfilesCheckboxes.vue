<script setup lang="ts">
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';

defineProps<{
  profiles: IAdsPowerProfile[];
}>();

const model = defineModel<string[]>({
  default: () => [],
});
</script>

<template>
  <q-checkbox
    v-for="profile in profiles"
    v-model="model"
    :label="profile.name"
    :val="profile.user_id"
    :key="profile.user_id"
  ></q-checkbox>
</template>
