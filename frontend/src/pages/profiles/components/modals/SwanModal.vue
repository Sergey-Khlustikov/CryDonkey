<script setup>
import {useDialogPluginComponent} from 'quasar';
import {ref} from 'vue';
import Api from 'src/api/Api';
import SwanSettings from 'src/pages/profiles/components/modals/SwanSettings.vue';
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

const formRef = ref(null);
const settings = ref({});
const generalSettings = ref({
  keepOpenProfileIds: [],
});

async function onSubmit() {
  await Api.runSwan({
    profiles: props.profiles.map(profile => {
      return { id: profile.user_id, name: profile.name };
    }),
    keepOpenProfileIds: generalSettings.value.keepOpenProfileIds,
    ...settings.value,
  });

  onDialogOK();
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 900px; max-width: 80vw;">
      <q-form @submit="onSubmit" ref="formRef" no-error-focus greedy>
        <div class="text-h6 q-ml-md q-mt-md">Swan Settings</div>

        <q-card-section>
          <general-job-settings
            v-model="generalSettings"
            :profiles="profiles"
            class="q-mb-md"
          ></general-job-settings>

          <swan-settings v-model="settings" :profiles="profiles" class="q-mb-md"></swan-settings>
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
