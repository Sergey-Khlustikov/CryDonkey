<script setup>
import SWAN_COMMENT_AUTOMATION_TYPES from 'src/domains/projects/swan/structures/SwanCommentAutomationTypes.mjs';

const model = defineModel({
  type: String,
  default: SWAN_COMMENT_AUTOMATION_TYPES.skip,
});

const options = [
  {val: SWAN_COMMENT_AUTOMATION_TYPES.skip, label: 'Skip'},
  {val: SWAN_COMMENT_AUTOMATION_TYPES.auto, label: 'Auto'},
  {val: SWAN_COMMENT_AUTOMATION_TYPES.manual, label: 'Manual'},
];
</script>

<template>
  <div>
    <q-radio v-for="option in options" v-model="model" :val="option.val" :label="option.label"></q-radio>
  </div>
</template>
