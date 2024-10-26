<script setup>
import { reactive, ref, watch } from 'vue';
import AIController from 'src/domains/ai/AIController';
import SWAN_COMMENT_AUTOMATION_TYPES from 'src/domains/projects/swan/structures/SwanCommentAutomationTypes.mjs';
import SwanCommentAutomationTypesRadio
  from 'src/domains/projects/swan/components/modals/SwanCommentAutomationTypesRadio.vue';
import ArrowBtn from 'src/components/ArrowBtn.vue';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const commentSettings = reactive({
  automationType: SWAN_COMMENT_AUTOMATION_TYPES.skip,
  quests: [],
});

const emitChanges = () => {
  const emitValue = {
    automationType: commentSettings.automationType,
    quests: null,
  };

  if (commentSettings.automationType === SWAN_COMMENT_AUTOMATION_TYPES.manual) {
    emitValue.quests = commentSettings.quests.map(quest => {
      return {
        title: quest.title,
        comments: quest.comments,
      };
    });
  }

  emit('update:modelValue', emitValue);
};

watch(commentSettings, emitChanges);

const addQuest = () => {
  commentSettings.quests.push({
    title: '',
    comments: props.profiles.map((profile) => ({
      profileId: profile.user_id,
      profileName: profile.name,
      comment: '',
    })),
    twitterPost: '',
    expanded: true,
    loading: false,
  });
};

const removeQuest = (index) => {
  commentSettings.quests.splice(index, 1);
};

const generateComments = async (quest, twitterPost) => {
  try {
    let message = `"${twitterPost}"`;

    message += `\n Generate ${props.profiles.length} neutral short response(s) to this twitter post, no emojis.
              \n Generate response in this template, without line separators, just plain array: "[comment 1, comment 2, ...]"`;

    quest.loading = true;

    const response = await AIController.generate(message);

    setAIResponse(quest, response);
  } finally {
    quest.loading = false;
  }
};

const setAIResponse = (quest, response) => {
  const aiComments = JSON.parse(response);

  for (let i = 0; i < quest.comments.length; i++) {
    quest.comments[i].comment = aiComments[i];
  }
};

const expanded = ref(true);
</script>

<template>
  <q-card bordered>
    <q-card-section @click="expanded = !expanded" class="flex justify-between items-center cursor-pointer">
      <div class="text-h6">Comments</div>
      <q-space/>

      <arrow-btn :model-value="expanded"></arrow-btn>
    </q-card-section>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator></q-separator>
        <q-card-section>
          <swan-comment-automation-types-radio v-model="commentSettings.automationType"></swan-comment-automation-types-radio>

          <template v-if="commentSettings.automationType === SWAN_COMMENT_AUTOMATION_TYPES.manual">
            <q-btn color="primary" @click="addQuest" class="q-mb-md q-mt-md">Add Quest</q-btn>

            <div v-if="commentSettings.quests.length">
              <q-card v-for="(quest, index) in commentSettings.quests" bordered class="q-mb-md">
                <q-card-section class="flex justify-between items-center">
                  <div class="">Quest #{{ index + 1 }}</div>

                  <div>
                    <q-btn
                      color="grey"
                      round
                      flat
                      dense
                      icon="delete"
                      @click="removeQuest(index)"
                    ></q-btn>

                    <arrow-btn v-model="quest.expanded"></arrow-btn>
                  </div>
                </q-card-section>

                <q-separator></q-separator>

                <q-slide-transition>
                  <div v-show="quest.expanded">
                    <q-card-section>
                      <q-input
                        v-model="quest.title"
                        :rules="[ val => val && val.length > 0]"
                        filled
                        label="Quest title"
                        class="q-mb-md"
                      ></q-input>

                      <q-card bordered class="q-mb-md">
                        <q-form @submit="generateComments(quest, quest.twitterPost)">
                          <q-card-section>
                            <div>Generate with AI</div>
                          </q-card-section>

                          <q-card-section>
                            <q-input
                              v-model="quest.twitterPost"
                              :rules="[ val => val && val.length > 0]"
                              type="textarea"
                              label="Twitter post"
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
                          v-for="comment in quest.comments"
                          v-model="comment.comment"
                          :rules="[ val => val && val.length > 0]"
                          type="textarea"
                          filled
                          :label="`Profile '${comment.profileName}' comment`"
                          :key="comment.profileId"
                          class="col-4"
                          rows="4"
                        ></q-input>
                      </div>

                      <q-inner-loading :showing="quest.loading">
                        <q-spinner-gears size="50px" color="primary"/>
                      </q-inner-loading>
                    </q-card-section>
                  </div>
                </q-slide-transition>
              </q-card>
            </div>
          </template>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
