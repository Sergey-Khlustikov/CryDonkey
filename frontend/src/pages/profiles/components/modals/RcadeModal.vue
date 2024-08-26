<script setup>
import {useDialogPluginComponent} from 'quasar';
import {ref} from 'vue';
import Api from 'src/api/Api';
import DontCloseProfiles from 'src/pages/profiles/components/DontCloseProfiles.vue';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

defineEmits([
  ...useDialogPluginComponent.emits,
]);

const {
  dialogRef,
  onDialogHide,
  onDialogOK,
  onDialogCancel,
} = useDialogPluginComponent();

const selectedNotToCloseProfiles = ref([]);

async function onSubmit() {
  await Api.runRcade({
    profiles: props.profiles.map(profile => {
      return {id: profile.user_id, name: profile.name};
    }),
    keepOpenProfileIds: selectedNotToCloseProfiles.value,
  });

  onDialogOK();
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 600px; max-width: 80vw;">
      <q-form @submit="onSubmit">
        <q-card-section>
          <dont-close-profiles v-model="selectedNotToCloseProfiles" :profiles="profiles"></dont-close-profiles>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-sm q-mb-sm">
          <q-btn color="primary" label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn color="primary" label="Run" style="width: 60px;" type="submit"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
