<script setup lang="ts">
import DontCloseProfiles from 'src/pages/profiles/components/DontCloseProfiles.vue';
import vRequired from 'src/helpers/validators/required.validator.js';
import vMoreThan from 'src/helpers/validators/more-than.validator.js';
import CollapsableModalSection from 'src/components/modals/CollapsableModalSection.vue';
import type { IAdsPowerProfile } from 'src/domains/ads-power/structures/ads-power-profile.interface.js';
import { type IGeneralJobSettings } from 'src/domains/jobs/structures/job-general-settings.interface.js';

interface Props {
  profiles: IAdsPowerProfile[];
}

defineProps<Props>();

const model = defineModel<IGeneralJobSettings>({ required: true });
</script>

<template>
  <collapsable-modal-section header-text="General Settings">
    <q-card-section>
      <dont-close-profiles
        v-model="model.keepOpenProfileIds"
        :profiles="profiles"
      ></dont-close-profiles>
    </q-card-section>

    <q-separator></q-separator>

    <q-card-section>
      <div class="q-mb-md">Set random job delay (minutes)</div>
      <div class="row q-col-gutter-md">
        <q-input
          v-model.number="model.minDelayMinutes"
          outlined
          stack-label
          label="Min job delay"
          :rules="[vRequired]"
          type="number"
          class="col-4"
        ></q-input>
        <q-input
          v-model.number="model.maxDelayMinutes"
          outlined
          stack-label
          label="Max job delay"
          :rules="[vRequired, (value) => vMoreThan(value, model.minDelayMinutes)]"
          type="number"
          class="col-4"
        ></q-input>
      </div>
    </q-card-section>
  </collapsable-modal-section>
</template>
