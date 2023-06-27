<template>
  <v-card :class="validationStatus">
    <v-card-title>Besoin d'eau</v-card-title>
    <v-card-subtitle
      >Si ton animation a besoin d'eau, il faut savoir quel est le débit dont tu
      as besoin et comment on l'évacue. Pour plus de renseignement, vois avec la
      Log Elec via
      <a href="mailto:logistique@24heures.org">logistique@24heures.org</a
      >.</v-card-subtitle
    >
    <v-card-text>
      <v-form @submit.prevent="">
        <!--
        <v-switch
          :value="waterNeed.waterFlowRequired"
          label="Besoin d'eau"
          @change="onChange('waterFlowRequired', $event)"
        ></v-switch>
        -->
        <v-text-field
          :value="mFA.waterNeed"
          label="Desctiption du besoin en eau"
          :disabled="isValidatedByOwner"
          @change="onChange('waterNeed', $event)"
        ></v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import { Fa } from "~/utils/models/FA";

export default Vue.extend({
  name: "WaterLogisticCard",
  data: () => ({
    owner: "elec",
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.FA.mFA;
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
  },
});
</script>
