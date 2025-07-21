<script setup>
import { TWITTER_POST_AUTOMATION_TYPES } from 'src/domains/twitter/structures/TwitterAutomationTypes';

const model = defineModel({
  type: String,
  default: TWITTER_POST_AUTOMATION_TYPES.auto,
});

const options = [
  { val: TWITTER_POST_AUTOMATION_TYPES.auto, label: 'Auto' },
  { val: TWITTER_POST_AUTOMATION_TYPES.manual, label: 'Manual' },
];
</script>

<template>
  <div>
    <q-radio
      v-for="option in options"
      v-model="model"
      :val="option.val"
      :label="option.label"
      :key="option.val"
    ></q-radio>
  </div>
</template>
