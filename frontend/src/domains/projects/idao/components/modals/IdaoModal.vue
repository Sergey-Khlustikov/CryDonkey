<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import GeneralJobSettings from 'src/pages/profiles/components/modals/GeneralJobSettings.vue';
import IdaoModalSettings from 'src/domains/projects/idao/components/modals/IdaoModalSettings.vue';
import IdaoController from 'src/domains/projects/idao/controllers/idao.controller.js';
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';
import {
  createDefaultGeneralJobSettings,
  type IGeneralJobSettings,
} from 'src/domains/jobs/structures/job-general-settings.interface.js';
import type { IIdaoRunSettings } from 'src/domains/projects/idao/structures/idao.run-settings.interface.js';
import type { RIdaoRun } from 'src/domains/projects/idao/requests/idao.run.request.js';

interface Props {
  profiles: IAdsPowerProfile[];
}

const props = defineProps<Props>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const generalSettings = ref<IGeneralJobSettings>(createDefaultGeneralJobSettings());
const settings = ref<IIdaoRunSettings>({
  minTargetPriceDeviation: 0,
  maxTargetPriceDeviation: 1,
});

async function onSubmit() {
  const params: RIdaoRun = {
    profiles: props.profiles.map((profile) => {
      return { id: profile.user_id, name: profile.name };
    }),
    ...settings.value,
    ...generalSettings.value,
  }
  await IdaoController.run(params);

  onDialogOK();
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 900px; max-width: 80vw">
      <div class="text-h6 q-ml-md q-mt-md">Idao Settings</div>

      <q-form @submit="onSubmit" no-error-focus greedy>
        <q-card-section>
          <general-job-settings
            v-model="generalSettings"
            :profiles="profiles"
            class="q-mb-md"
          ></general-job-settings>

          <idao-modal-settings
            v-model="settings"
            :profiles="profiles"
            class="q-mb-md"
          ></idao-modal-settings>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-sm q-mb-sm">
          <q-btn color="red" label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn color="green" label="Run" style="width: 60px" type="submit"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
