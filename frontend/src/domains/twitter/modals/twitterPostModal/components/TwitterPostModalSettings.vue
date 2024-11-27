<script setup>
import SWAN_COMMENT_AUTOMATION_TYPES from 'src/domains/projects/swan/structures/SwanCommentAutomationTypes.mjs';
import TwitterPostAutomationTypesRadio
  from 'src/domains/twitter/modals/twitterPostModal/components/TwitterPostAutomationTypesRadio.vue';
import { reactive, ref, watch } from 'vue';
import AIController from 'src/domains/ai/AIController';
import CollapsableModalSection from 'src/components/modals/CollapsableModalSection.vue';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const model = defineModel();

const loading = ref(false);

const posts = reactive(props.profiles.map(profile => ({post: '', profileId: profile.user_id})));

watch(posts, (newValue) => {
  model.value.posts = newValue;
});

const userPrompt = ref('Generate unique short human-like twitter posts on one of these topics - ' +
  'crypto, cooking, nature, business, travelling, news, history. 1-2 sentences, no emojis.');

const generatePosts = async () => {
  try {
    loading.value = true;
    const prompt = userPrompt.value + `\n Generate ${props.profiles.length} response in this template,
                   without line separators, just plain array: "[post 1, post 2, ...]"`;
    const response = await AIController.generate(prompt);

    setAIResponse(response);
  } finally {
    loading.value = false;
  }
};

const setAIResponse = (response) => {
  const aiPosts = JSON.parse(response);

  for (let i = 0; i < posts.length; i++) {
    posts[i].post = aiPosts[i];
  }
};

const getProfileNameById = (id) => {
  return props.profiles.find(profile => profile.user_id === id).name;
};
</script>

<template>
  <collapsable-modal-section header-text="Posts">
    <q-card-section>
      <twitter-post-automation-types-radio v-model="model.automationType"></twitter-post-automation-types-radio>

      <template v-if="model.automationType === SWAN_COMMENT_AUTOMATION_TYPES.manual">
        <q-card-section>
          <q-card bordered class="q-mb-md">
            <q-form @submit="generatePosts">
              <q-card-section>
                <div>Generate with AI</div>
              </q-card-section>

              <q-card-section>
                <q-input
                  v-model="userPrompt"
                  :rules="[ val => val && val.length > 0]"
                  type="textarea"
                  label="Prompt to AI"
                  class="q-mb-md"
                ></q-input>
                <q-btn color="green" type="submit">
                  Generate
                </q-btn>
              </q-card-section>
            </q-form>
          </q-card>

          <div class="row q-col-gutter-md">
            <q-input
              v-for="post in posts"
              v-model="post.post"
              :rules="[ val => val && val.length > 0]"
              type="textarea"
              filled
              :label="`Profile '${getProfileNameById(post.profileId)}' post`"
              :key="post.profileId"
              class="col-4"
              rows="4"
            ></q-input>
          </div>

          <q-inner-loading :showing="loading">
            <q-spinner-gears size="50px" color="primary"/>
          </q-inner-loading>
        </q-card-section>
      </template>
    </q-card-section>
  </collapsable-modal-section>
</template>
