<script setup lang="ts">
import { ref } from 'vue';
import UserSettingsGeneralTab from 'src/pages/user_settings/components/UserSettingsGeneralTab.vue';

const tab = ref('general');
const splitterModel = ref(20);
</script>

<template>
  <q-page padding>
    <div>
      <q-splitter v-model="splitterModel">

        <template v-slot:before>
          <q-tabs v-model="tab" vertical active-bg-color="primary" active-color="white">
            <q-tab name="general" label="General"/>
            <q-tab name="password" label="Password"/>
          </q-tabs>
        </template>

        <template v-slot:after>
          <q-tab-panels
            v-model="tab"
            animated
            swipeable
            vertical
            transition-prev="jump-up"
            transition-next="jump-up"
          >
            <q-tab-panel name="general">
              <user-settings-general-tab></user-settings-general-tab>
            </q-tab-panel>

            <q-tab-panel name="password">
              <div class="text-h4 q-mb-md">Password</div>
            </q-tab-panel>
          </q-tab-panels>
        </template>

      </q-splitter>
    </div>
  </q-page>
</template>
