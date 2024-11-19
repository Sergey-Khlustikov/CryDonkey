<script setup>
import { useQuasar } from 'quasar';
import RcadeModal from 'src/pages/profiles/components/modals/RcadeModal.vue';
import TwitterPostModal from 'src/domains/twitter/modals/twitterPostModal/TwitterPostModal.vue';
import BlumModal from 'src/domains/projects/blum/components/modals/BlumModal.vue';
import IdaoModal from 'src/domains/projects/idao/components/modals/IdaoModal.vue';
import DawnController from 'src/domains/projects/dawn/controllers/DawnController.js';

const $q = useQuasar();
const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

function openRcadeModal() {
  $q.dialog({
    component: RcadeModal,
    componentProps: {
      profiles: props.profiles,
    },
  });
}

function openTwitterPostModal() {
  $q.dialog({
    component: TwitterPostModal,
    componentProps: {
      profiles: props.profiles,
    },
  });
}

function openBlumModal() {
  $q.dialog({
    component: BlumModal,
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
    profiles: props.profiles.map(profile => ({id: profile.user_id, name: profile.name})),
  });
}

</script>

<template>
  <div class="q-pa-md">
    <q-btn-dropdown color="primary" label="Run Job" :disable="!profiles.length">
      <q-list>
        <q-item clickable v-close-popup @click="openRcadeModal">
          <q-item-section>
            <q-item-label>
              <q-icon name="play_arrow"></q-icon>
              Rcade
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="openTwitterPostModal">
          <q-item-section>
            <q-item-label>
              <q-icon name="play_arrow"></q-icon>
              Twitter Post
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="openBlumModal">
          <q-item-section>
            <q-item-label>
              <q-icon name="play_arrow"></q-icon>
              Blum
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
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
