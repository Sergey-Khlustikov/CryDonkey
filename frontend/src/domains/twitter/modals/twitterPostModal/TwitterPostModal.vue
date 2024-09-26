<script setup>
import {useDialogPluginComponent} from 'quasar';
import {ref} from 'vue';
import GeneralJobSettings from 'src/pages/profiles/components/modals/GeneralJobSettings.vue';
import TwitterController from 'src/domains/twitter/TwitterController';
import {TWITTER_POST_AUTOMATION_TYPES} from 'src/domains/twitter/structures/TwitterAutomationTypes';
import TwitterPostModalSettings
  from 'src/domains/twitter/modals/twitterPostModal/components/TwitterPostModalSettings.vue';

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
const settings = ref({
  posts: [],
  automationType: TWITTER_POST_AUTOMATION_TYPES.auto,
});
const generalSettings = ref({
  keepOpenProfileIds: [],
});

async function onSubmit() {
  await TwitterController.writePost({
    profiles: props.profiles.map(profile => {
      return {id: profile.user_id, name: profile.name};
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
        <div class="text-h6 q-ml-md q-mt-md">Twitter Post</div>

        <q-card-section>
          <general-job-settings
            v-model="generalSettings"
            :profiles="profiles"
            class="q-mb-md"
          ></general-job-settings>

          <twitter-post-modal-settings v-model="settings" :profiles="profiles"></twitter-post-modal-settings>
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
