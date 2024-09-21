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

const selectedProfiles = ref([]);
const selectAll = ref(false);

watch(selectedProfiles, (newValue) => {
  selectAll.value = newValue.length === props.profiles.length;
});

const toggleSelectAll = (value) => {
  selectAll.value = value;

  if (value) {
    onSelectedUpdated(props.profiles.map(profile => (profile.user_id)));
  } else {
    onSelectedUpdated([]);
  }
};

const onSelectedUpdated = (value) => {
  selectedProfiles.value = value;
  emit('update:modelValue', selectedProfiles.value);
};
</script>

<template>
  <div>
    <div>Don't close profiles:</div>
    <div>
      <q-checkbox
        v-model="selectAll"
        label="Select All"
        @update:model-value="toggleSelectAll"
      ></q-checkbox>
    </div>

    <select-profiles-checkboxes
      :model-value="selectedProfiles"
      @update:model-value="onSelectedUpdated"
      :profiles="profiles"
    ></select-profiles-checkboxes>
  </div>
</template>
