<script setup>
import {ref} from 'vue';
import AIController from 'src/domains/ai/AIController';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const quests = ref([]);

const addQuest = () => {
  quests.value.push({
    title: '',
    comments: props.profiles.map((profile) => ({profileId: profile.user_id, profileName: profile.name, comment: ''})),
    twitterPost: '',
    expanded: true,
    loading: false,
  });
};

const removeQuest = (index) => {
  quests.value.splice(index, 1);
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
</script>

<template>
  <q-card-section class="flex justify-between items-center">
    <div class="text-h6">Comments</div>

    <q-card-section>
      <q-btn color="green" @click="addQuest">Add Quest</q-btn>
    </q-card-section>
  </q-card-section>

  <div v-if="quests.length >= 0">
    <q-card v-for="(quest, index) in quests" bordered class="q-mb-md">
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

          <q-btn
            color="grey"
            round
            flat
            dense
            :icon="quest.expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
            @click="quest.expanded = !quest.expanded"
          ></q-btn>
        </div>
      </q-card-section>

      <q-separator></q-separator>

      <q-slide-transition>
        <div v-show="quest.expanded">
          <q-card-section>
            <q-input v-model="quest.title" filled label="Quest title" class="q-mb-md"></q-input>

            <q-card bordered class="q-mb-md">
              <q-card-section>
                <div>Generate with AI</div>
              </q-card-section>

              <q-card-section>
                <q-input v-model="quest.twitterPost" type="textarea" label="Twitter post" class="q-mb-md"></q-input>
                <q-btn color="primary" @click="generateComments(quest, quest.twitterPost)">Generate</q-btn>
              </q-card-section>
            </q-card>

            <div class="row q-col-gutter-md">
              <q-input
                v-for="comment in quest.comments"
                v-model="comment.comment"
                type="textarea"
                filled
                :label="`Profile ${comment.profileName} comment`"
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

