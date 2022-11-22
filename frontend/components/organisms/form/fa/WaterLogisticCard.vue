<template>
  <v-card>
    <v-card-title>Eau</v-card-title>
    <v-card-subtitle
      >Si ton animation a besoin d'eau, il faut savoir quel est le débit dont tu
      as besoin et comment on l'évacue. pour plus de renseignement voit avec la
      Log Elec via logistique@24heures.org</v-card-subtitle
    >
    <v-card-text>
      <v-form>
        <!--
        <v-switch
          :value="waterNeed.isWaterNeeded"
          label="Besoin d'eau"
          @change="onChange('isWaterNeeded', $event)"
        ></v-switch>
        -->
        <v-text-field
          :value="waterNeed.water_needs"
          label="Desctiption du besoin en eau"
          @change="onChange('waterNeed', $event)"
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
  computed: {
    waterNeed(): FA {
      return this.$accessor.FA.mFA;
    },
  },
  methods: {
    onChange(name: string, value: any) {
      if (typeof value === "string") value = value.trim();
      console.log(name + " : " + value);
      // Mettre à jour le store
    },
  },
});
</script>

<style scoped></style>
