<script setup>
const model = defineModel();
const emits = defineEmits(['click']);

const onClick = () => {
  model.value = !model.value;
  emits('click');
};
</script>

<template>
  <q-btn
    @click="onClick"
    color="grey"
    round
    flat
    dense
    :icon="model ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
  ></q-btn>
</template>
