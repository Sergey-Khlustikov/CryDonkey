<script setup lang="ts">
import vRequired from 'src/helpers/validators/required.validator.js';
import vMoreThan from 'src/helpers/validators/more-than.validator.js';
import vLessOrEqualThan from 'src/helpers/validators/less-or-equal-than.validator.js';
import CollapsableModalSection from 'src/components/modals/CollapsableModalSection.vue';
import type { IIdaoRunSettings } from 'src/domains/projects/idao/structures/idao.run-settings.interface.js';

const model = defineModel<IIdaoRunSettings>({ required: true });
</script>

<template>
  <collapsable-modal-section header-text="Forecast Settings">
    <q-card-section>
      <div class="row q-col-gutter-md">
        <q-input
          v-model.number="model.minTargetPriceDeviation"
          outlined
          stack-label
          label="Min target price deviation"
          :rules="[vRequired]"
          type="number"
          step="0.01"
          class="col-4"
        >
          <template v-slot:append>%</template>
        </q-input>

        <q-input
          v-model.number="model.maxTargetPriceDeviation"
          outlined
          stack-label
          label="Max target price deviation"
          :rules="[
            vRequired,
            (value) => vMoreThan(value, model.minTargetPriceDeviation),
            (value) => vLessOrEqualThan(value, 100),
          ]"
          type="number"
          step="0.01"
          class="col-4"
        >
          <template v-slot:append>%</template>
        </q-input>
      </div>
    </q-card-section>
  </collapsable-modal-section>
</template>
