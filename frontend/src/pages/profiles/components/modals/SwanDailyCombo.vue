<script setup>
import { reactive, watch } from 'vue';

const emit = defineEmits(['update:modelValue']);

const dailyCombo = reactive({
  first: null,
  second: null,
  third: null,
});

watch(dailyCombo, (newValue) => {
  emit('update:modelValue', newValue);
});

</script>

<template>
  <div class="row no-wrap q-gutter-md">
    <q-input
      filled
      v-model="dailyCombo.first"
      label="First number"
      lazy-rules
      :rules="[ val => val !== null && val.length > 0]"
      type="number"
    ></q-input>
    <q-input
      filled
      v-model="dailyCombo.second"
      label="Second number"
      lazy-rules
      :rules="[ val => val !== null && val.length > 0]"
      type="number"
    ></q-input>
    <q-input
      filled
      v-model="dailyCombo.third"
      label="Third number"
      lazy-rules
      :rules="[ val => val !== null && val.length > 0]"
      type="number"
    ></q-input>
  </div>
</template>
