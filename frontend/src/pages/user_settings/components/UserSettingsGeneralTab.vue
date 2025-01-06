<script setup>
import { onBeforeMount, ref } from 'vue';
import UserAppSettingsController from 'src/domains/user/controllers/UserAppSettingsController';
import AdsPowerAddresses from 'src/pages/user_settings/components/AdsPowerAddresses.vue';

const appSettings = ref({});
const loading = ref(false);
const selectedActiveAddress = ref(null);

const getUserAppSettings = async () => {
  try {
    loading.value = true;
    appSettings.value = await UserAppSettingsController.get();
    selectedActiveAddress.value = appSettings.value.activeAdsPowerAddress;
  } finally {
    loading.value = false;
  }
};

const saveSettings = async () => {
  await UserAppSettingsController.update({ activeAdsPowerAddress: selectedActiveAddress.value });
};

onBeforeMount(() => {
  getUserAppSettings();
});
</script>

<template>
  <q-inner-loading :showing="loading">
    <q-spinner-gears size="50px" color="primary"/>
  </q-inner-loading>

  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div v-show="!loading">
      <ads-power-addresses v-model:activeAddress="selectedActiveAddress"></ads-power-addresses>
      <q-separator class="q-my-md"></q-separator>
      <q-btn
        label="Save"
        color="green"
        @click="saveSettings"
      ></q-btn>
    </div>
  </transition>
</template>
