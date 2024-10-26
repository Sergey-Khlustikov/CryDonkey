<script setup>
import SwanDailyCombo from 'src/domains/projects/swan/components/modals/SwanDailyCombo.vue';
import { onMounted, reactive, watch } from 'vue';
import SwanComments from 'src/domains/projects/swan/components/modals/SwanComments.vue';
import SWAN_COMMENT_AUTOMATION_TYPES from 'src/domains/projects/swan/structures/SwanCommentAutomationTypes.mjs';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const settings = reactive({
  onlyDaily: false,
  dailyCombo: {
    first: null,
    second: null,
    third: null,
  },
  commentSettings: {
    automationType: SWAN_COMMENT_AUTOMATION_TYPES.skip,
    quests: [],
  },
});

watch(settings, (newValue) => {
  emit('update:modelValue', newValue);
});

onMounted(() => {
  emit('update:modelValue', settings);
});
</script>

<template>
  <div>
    <swan-daily-combo
      v-model:dailyCombo="settings.dailyCombo"
      v-model:onlyDaily="settings.onlyDaily"
    ></swan-daily-combo>

    <q-separator class="q-mb-md"></q-separator>

    <swan-comments v-model="settings.commentSettings" :profiles="profiles"></swan-comments>
  </div>
</template>
