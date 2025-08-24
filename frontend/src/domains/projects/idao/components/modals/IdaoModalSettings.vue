<script setup lang="ts">
import IdaoModalSettingsForecast from 'src/domains/projects/idao/components/modals/IdaoModalSettingsForecast.vue';
import type { IIdaoRunSettings } from 'src/domains/projects/idao/structures/idao.run-settings.interface.js';

const settings = defineModel<IIdaoRunSettings>({ required: true });
</script>

<template>
  <idao-modal-settings-forecast v-model="settings"></idao-modal-settings-forecast>
</template>
