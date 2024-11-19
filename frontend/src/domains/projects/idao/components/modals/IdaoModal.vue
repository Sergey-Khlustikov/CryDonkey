<script setup>
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import GeneralJobSettings from 'src/pages/profiles/components/modals/GeneralJobSettings.vue';
import IdaoModalSettings from 'src/domains/projects/idao/components/modals/IdaoModalSettings.vue';
import IdaoController from 'src/domains/projects/idao/controllers/IdaoController';

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

const formRef = ref(null);
const generalSettings = ref({});
const settings = ref({});

async function onSubmit() {
  await IdaoController.run({
    profiles: props.profiles.map(profile => {
      return { id: profile.user_id, name: profile.name };
    }),
    ...settings.value,
    ...generalSettings.value,
  });

  onDialogOK();
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 900px; max-width: 80vw;">
      <div class="text-h6 q-ml-md q-mt-md">Idao Settings</div>

      <q-form @submit="onSubmit" ref="formRef" no-error-focus greedy>
        <q-card-section>
          <general-job-settings
            v-model="generalSettings"
            :profiles="profiles"
            class="q-mb-md"
          ></general-job-settings>

          <idao-modal-settings v-model="settings" :profiles="profiles" class="q-mb-md"></idao-modal-settings>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-sm q-mb-sm">
          <q-btn color="red" label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn
            color="green"
            label="Run"
            style="width: 60px;"
            type="submit"
          ></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
