<script setup>
import SwanModal from 'src/pages/profiles/components/modals/SwanModal.vue';
import {useQuasar} from 'quasar';
import RcadeModal from 'src/pages/profiles/components/modals/RcadeModal.vue';
import TwitterPostModal from 'src/domains/twitter/modals/twitterPostModal/TwitterPostModal.vue';
import BlumModal from 'src/pages/profiles/components/modals/BlumModal.vue';

const $q = useQuasar();
const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

function openSwanModal() {
  $q.dialog({
    component: SwanModal,
    componentProps: {
      profiles: props.profiles,
    },
  });
}

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

        <q-item clickable v-close-popup @click="openSwanModal">
          <q-item-section>
            <q-item-label>
              <q-icon name="play_arrow"></q-icon>
              Swan
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
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
