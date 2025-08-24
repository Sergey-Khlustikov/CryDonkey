<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import UserAppSettingsController from 'src/domains/user/controllers/user-app-settings.controller.js';
import AdsPowerAddresses from 'src/pages/user_settings/components/AdsPowerAddresses.vue';
import type { IUserAppSettings } from 'src/domains/user/structures/user-app-settings.interface.js';
import type { RUserAppSettingsUpdate } from 'src/domains/user/requests/user-app-settings.update.request.js';

const appSettings = ref<IUserAppSettings | null>(null);
const loading = ref(false);
const selectedActiveAddress = ref<string | null>(null);

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
  const params: RUserAppSettingsUpdate = {
    activeAdsPowerAddress: selectedActiveAddress.value,
  };
  await UserAppSettingsController.update(params);
};

onBeforeMount(async () => {
  await getUserAppSettings();
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
