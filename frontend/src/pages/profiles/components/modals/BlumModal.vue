<script setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import Api from 'src/api/Api';
import GeneralJobSettings from 'src/pages/profiles/components/modals/GeneralJobSettings.vue';

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

async function onSubmit() {
  await Api.runBlum({
    profiles: props.profiles.map(profile => {
      return {id: profile.user_id, name: profile.name};
    }),
    ...generalSettings.value,
  });

  onDialogOK();
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 600px; max-width: 80vw;">
      <q-form @submit="onSubmit">
        <q-card-section>
          <general-job-settings
            v-model="generalSettings"
            :profiles="profiles"
            class="q-mb-md"
          ></general-job-settings>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-sm q-mb-sm">
          <q-btn color="primary" label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn color="primary" label="Run" style="width: 60px;" type="submit"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
