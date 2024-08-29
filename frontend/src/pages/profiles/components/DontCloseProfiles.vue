<script setup>
import {ref, watch} from 'vue';
import SelectProfilesCheckboxes from 'src/pages/profiles/components/SelectProfilesCheckboxes.vue';

const props = defineProps({
  profiles: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);

const dontCloseProfiles = ref(false);
const selectedProfiles = ref([]);

watch(dontCloseProfiles, (newValue) => {
  if (!newValue) {
    selectedProfiles.value = [];
    emit('update:modelValue', selectedProfiles.value);
  }
});

const onSelectedUpdated = (value) => {
  selectedProfiles.value = value;
  emit('update:modelValue', selectedProfiles.value);
};
</script>

<template>
  <div>
    <q-checkbox v-model="dontCloseProfiles" label="Don't close profiles:"></q-checkbox>

    <div v-if="dontCloseProfiles">
      <select-profiles-checkboxes
        :model-value="selectedProfiles"
        @update:model-value="onSelectedUpdated"
        :profiles="profiles"
      ></select-profiles-checkboxes>
    </div>
  </div>
</template>
