<script setup lang="ts">
import { useQuasar } from 'quasar';
import TwitterPostModal from 'src/domains/twitter/modals/twitter-post-modal/TwitterPostModal.vue';
import IdaoModal from 'src/domains/projects/idao/components/modals/IdaoModal.vue';
import DawnController from 'src/domains/projects/dawn/controllers/dawn.controller.js';
import RabbyController from 'src/domains/extentions/rabby/controllers/rabby.controller.js';
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';

const $q = useQuasar();
const props = defineProps<{
  profiles: IAdsPowerProfile[]
}>();

function openTwitterPostModal() {
  $q.dialog({
    component: TwitterPostModal,
    componentProps: {
      profiles: props.profiles,
    },
  });
}

function openIdaoModal() {
  $q.dialog({
    component: IdaoModal,
    componentProps: {
      profiles: props.profiles,
    },
  });
}

async function checkDawnAuth() {
  await DawnController.checkAuth({
    profiles: props.profiles.map(profile => ({ id: profile.user_id, name: profile.name })),
  });
}

async function unlockRabby() {
  await RabbyController.unlock({
    profiles: props.profiles.map(profile => ({ id: profile.user_id, name: profile.name })),
  });
}
</script>

<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="primary" label="Run Job" :disable="!profiles.length">
      <q-list>
        <q-item clickable v-close-popup @click="openTwitterPostModal">
          <q-item-section>
            <q-item-label>
              <q-icon name="play_arrow"></q-icon>
              Twitter Post
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="openIdaoModal">
          <q-item-section>
            <q-item-label>
              <q-icon name="play_arrow"></q-icon>
              IDAO
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="checkDawnAuth">
          <q-item-section>
            <q-item-label>
              <q-icon name="play_arrow"></q-icon>
              Dawn. Check Auth
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="unlockRabby">
          <q-item-section>
            <q-item-label>
              <q-icon name="play_arrow"></q-icon>
              Rabby. Unlock
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
