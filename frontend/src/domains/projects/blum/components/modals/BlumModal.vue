<script setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import GeneralJobSettings from 'src/pages/profiles/components/modals/GeneralJobSettings.vue';
import BlumModalOptions from 'src/domains/projects/blum/components/modals/BlumModalOptions.vue';
import BlumController from 'src/domains/projects/blum/controllers/BlumController';

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

const generalSettings = ref({});
const options = ref({});

async function onSubmit() {
  await BlumController.run({
    profiles: props.profiles.map(profile => {
      return {id: profile.user_id, name: profile.name};
    }),
    ...generalSettings.value,
    options: options.value,
  });

  onDialogOK();
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 600px; max-width: 80vw;">
      <div class="text-h6 q-ml-md q-mt-md">Blum Settings</div>

      <q-form @submit="onSubmit" no-error-focus greedy>
        <q-card-section>
          <general-job-settings
            v-model="generalSettings"
            :profiles="profiles"
            class="q-mb-md"
          ></general-job-settings>

          <blum-modal-options v-model="options"></blum-modal-options>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-sm q-mb-sm">
          <q-btn color="primary" label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn color="primary" label="Run" style="width: 60px;" type="submit"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
