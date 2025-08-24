<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import GeneralJobSettings from 'src/pages/profiles/components/modals/GeneralJobSettings.vue';
import TwitterController from 'src/domains/twitter/controllers/twitter.controller.js';
import { ETwitterPostAutomationTypes } from 'src/domains/twitter/structures/twitter-post-automation-types.enum.js';
import TwitterPostModalSettings
  from 'src/domains/twitter/modals/twitter-post-modal/components/TwitterPostModalSettings.vue';
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';
import {
  createDefaultGeneralJobSettings,
  type IGeneralJobSettings,
} from 'src/domains/jobs/structures/job-general-settings.interface.js';
import type { ITwitterPostSettings } from 'src/domains/twitter/structures/twitter-post-settings.interface.js';
import type { RTwitterWritePost } from 'src/domains/twitter/requests/twitter.write-post.request.js';

interface Props {
  profiles: IAdsPowerProfile[];
}

const props = defineProps<Props>();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const settings = ref<ITwitterPostSettings>({
  posts: [],
  automationType: ETwitterPostAutomationTypes.Auto,
});
const generalSettings = ref<IGeneralJobSettings>(createDefaultGeneralJobSettings());

async function onSubmit() {
  const params: RTwitterWritePost = {
    profiles: props.profiles.map((profile) => {
      return { id: profile.user_id, name: profile.name };
    }),
    ...settings.value,
    ...generalSettings.value,
  };
  await TwitterController.writePost(params);

  onDialogOK();
}
</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 900px; max-width: 80vw">
      <div class="text-h6 q-ml-md q-mt-md">Twitter Post</div>

      <q-form @submit="onSubmit" no-error-focus greedy>
        <q-card-section>
          <general-job-settings
            v-model="generalSettings"
            :profiles="profiles"
            class="q-mb-md"
          ></general-job-settings>

          <twitter-post-modal-settings
            v-model="settings"
            :profiles="profiles"
          ></twitter-post-modal-settings>
        </q-card-section>

        <q-card-actions align="right" class="q-mr-sm q-mb-sm">
          <q-btn color="red" label="Cancel" @click="onDialogCancel"></q-btn>
          <q-btn color="green" label="Run" style="width: 60px" type="submit"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>
