<script setup lang="ts">
import { ETwitterPostAutomationTypes } from 'src/domains/twitter/structures/twitter-post-automation-types.enum.js';

const model = defineModel({
  type: String,
  default: ETwitterPostAutomationTypes.Auto,
});

const options = [
  { val: ETwitterPostAutomationTypes.Auto, label: 'Auto' },
  { val: ETwitterPostAutomationTypes.Manual, label: 'Manual' },
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
