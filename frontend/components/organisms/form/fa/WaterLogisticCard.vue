<template>
  <v-card :class="isDisabled ? 'disabled' : ''">
    <v-card-title>Besoin d'eau</v-card-title>
    <v-card-subtitle
      >Si ton animation a besoin d'eau, il faut savoir quel est le débit dont tu
      as besoin et comment on l'évacue. Pour plus de renseignement, vois avec la
      Log Elec via logistique@24heures.org</v-card-subtitle
    >
    <v-card-text>
      <v-form @submit.prevent="">
        <!--
        <v-switch
          :value="waterNeed.water_flow_required"
          label="Besoin d'eau"
          @change="onChange('water_flow_required', $event)"
        ></v-switch>
        -->
        <v-text-field
          :value="waterNeed.water_needs"
          label="Desctiption du besoin en eau"
          :disabled="isDisabled"
          @change="onChange('water_needs', $event)"
        ></v-text-field>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FA } from "~/utils/models/FA";

export default Vue.extend({
  name: "WaterLogisticCard",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    waterNeed(): FA {
      return this.$accessor.FA.mFA;
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
