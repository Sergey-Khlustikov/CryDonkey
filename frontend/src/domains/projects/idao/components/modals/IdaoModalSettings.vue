<script setup>
import IdaoModalSettingsForecast from 'src/domains/projects/idao/components/modals/IdaoModalSettingsForecast.vue';

const settings = defineModel();

</script>

<template>
  <idao-modal-settings-forecast v-model="settings"></idao-modal-settings-forecast>
</template>
