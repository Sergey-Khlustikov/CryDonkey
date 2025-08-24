<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import GeneralJobSettings from 'pages/profiles/components/modals/GeneralJobSettings.vue';
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';
import {
  createDefaultGeneralJobSettings,
  type IGeneralJobSettings,
} from 'src/domains/jobs/structures/job-general-settings.interface.js';

defineProps<{
  profiles: IAdsPowerProfile[];
}>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

const generalSettings = ref<IGeneralJobSettings>(createDefaultGeneralJobSettings());
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 600px; max-width: 80vw">
      <div class="text-h6 q-ml-md q-mt-md">Rcade Settings</div>

      <q-form>
        <q-card-section>
          <general-job-settings
            v-model="generalSettings"
            :profiles="profiles"
            class="q-mb-md"
          ></general-job-settings>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-sm q-mb-sm">
          <q-btn color="primary" label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn color="primary" label="Run" style="width: 60px" type="submit"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
