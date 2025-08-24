<script setup lang="ts">
import TwitterPostAutomationTypesRadio
  from 'src/domains/twitter/modals/twitter-post-modal/components/TwitterPostAutomationTypesRadio.vue';
import { ref, watch } from 'vue';
import CollapsableModalSection from 'src/components/modals/CollapsableModalSection.vue';
import { ETwitterPostAutomationTypes } from 'src/domains/twitter/structures/twitter-post-automation-types.enum.js';
import OpenAIController from 'src/domains/ai/controllers/open-ai.controller.js';
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';
import type { ITwitterPostSettings } from 'src/domains/twitter/structures/twitter-post-settings.interface.js';
import type { ITwitterPost } from 'src/domains/twitter/structures/twitter-post.interface.js';
import { useNotify } from 'src/helpers/notify/useNotify.js';

const { notifyInfo } = useNotify();

interface Props {
  profiles: IAdsPowerProfile[];
}

const props = defineProps<Props>();

const model = defineModel<ITwitterPostSettings>({ required: true });

const loading = ref(false);

const posts = ref<ITwitterPost[]>(
  props.profiles.map((profile) => ({ post: '', profileId: profile.user_id })),
);

watch(posts, (newValue) => {
  model.value.posts = newValue;
});

const userPrompt = ref(
  'Generate unique short human-like twitter posts on one of these topics - ' +
  'crypto, cooking, nature, business, travelling, news, history. 1-2 sentences, no emojis.',
);

const generatePosts = async () => {
  try {
    loading.value = true;

    const prompt =
      userPrompt.value +
      `\n Generate ${props.profiles.length} response in this template,
                   without line separators, just plain array: "[post 1, post 2, ...]"`;

    const response = await OpenAIController.generate(prompt);
    validateAIResponse(response);
    setAIResponse(getParsedResponse(response));
  } finally {
    loading.value = false;
  }
};

const validateAIResponse = (response: string): void => {
  const parsedResponse = getParsedResponse(response);

  if (parsedResponse.length !== props.profiles.length) {
    notifyInfo('AI generated wrong number of posts. Regenerate again or edit manually.');
  }
};

const getParsedResponse = (response: string): string[] => {
  return JSON.parse(response);
};

const setAIResponse = (aiPosts: string[]): void => {
  for (let i = 0; i < posts.value.length; i++) {
    const targetPost = posts.value[i];

    if (!targetPost) {
      continue;
    }

    targetPost.post = aiPosts[i] ?? '';
  }
};

const getProfileNameById = (id: string): string => {
  const profile = props.profiles.find((profile) => profile.user_id === id);

  return profile?.name ?? '';
};
</script>

<template>
  <collapsable-modal-section header-text="Posts">
    <q-card-section>
      <twitter-post-automation-types-radio
        v-model="model.automationType"
      ></twitter-post-automation-types-radio>

      <template v-if="model.automationType === ETwitterPostAutomationTypes.Manual">
        <q-card-section>
          <q-card bordered class="q-mb-md">
            <q-form @submit="generatePosts">
              <q-card-section>
                <div>Generate with AI</div>
              </q-card-section>

              <q-card-section>
                <q-input
                  v-model="userPrompt"
                  :rules="[(val) => val && val.length > 0]"
                  type="textarea"
                  label="Prompt to AI"
                  class="q-mb-md"
                ></q-input>
                <q-btn color="green" type="submit"> Generate</q-btn>
              </q-card-section>
            </q-form>
          </q-card>

          <div class="row q-col-gutter-md">
            <q-input
              v-for="post in posts"
              v-model="post.post"
              :rules="[(val) => val && val.length > 0]"
              type="textarea"
              filled
              :label="`Profile '${getProfileNameById(post.profileId)}' post`"
              :key="post.profileId"
              class="col-4"
              rows="4"
            ></q-input>
          </div>

          <q-inner-loading :showing="loading">
            <q-spinner-gears size="50px" color="primary" />
          </q-inner-loading>
        </q-card-section>
      </template>
    </q-card-section>
  </collapsable-modal-section>
</template>
