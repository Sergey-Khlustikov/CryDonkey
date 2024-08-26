<script setup>
import SwanModal from 'src/pages/profiles/components/modals/SwanModal.vue';
import {useQuasar} from 'quasar';
import CustomQueueModal from 'src/pages/profiles/components/modals/CustomQueueModal.vue';
import RcadeModal from 'src/pages/profiles/components/modals/RcadeModal.vue';

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

function openCustomQueueModal() {
  $q.dialog({
    component: CustomQueueModal,
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

        <q-item clickable v-close-popup @click="openCustomQueueModal">
          <q-item-section>
            <q-item-label>
              <q-icon name="play_arrow"></q-icon>
              Rcade + Swan
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>
