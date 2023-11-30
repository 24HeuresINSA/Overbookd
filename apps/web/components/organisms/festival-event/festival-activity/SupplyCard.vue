<template>
  <v-card>
    <v-card-title>Besoin d'elec/eau</v-card-title>
    <v-card-subtitle>
      Précise tes besoins en électricité : 1 ligne par type d'appareil. Si ton
      animation a besoin d'eau, renseigne le débit dont tu as besoin et comment
      l'évacuer.<br />
      Pour plus de renseignement, vois avec la Log Elec via
      <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>.
    </v-card-subtitle>
    <v-card-text>
      <ElectricitySupplyTable
        :supplies="supply.electricity"
        @add="addElectricitySupply"
        @update="updateElectricitySupply"
        @delete="deleteElectricitySupply"
      />

      <v-text-field
        :value="supply.water"
        label="Besoin en eau"
        @change="updateWaterSupply($event)"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ElectricitySupplyTable from "~/components/molecules/festival-event/logistic/supply/ElectricitySupplyTable.vue";
import {
  FestivalActivity,
  ElectricitySupply,
} from "@overbookd/festival-activity";
import { NewElectricitySupply } from "~/utils/festival-event/festival-activity.model";

export default defineComponent({
  name: "SupplyCard",
  components: { ElectricitySupplyTable },
  computed: {
    supply(): FestivalActivity["supply"] {
      return this.$accessor.festivalActivity.selectedActivity.supply;
    },
  },
  methods: {
    addElectricitySupply(newSupply: NewElectricitySupply) {
      console.log("add electricity", newSupply);
      // TODO: add electricity supply
    },
    updateElectricitySupply(supply: ElectricitySupply) {
      console.log("update electricity", supply);
      // TODO: update electricity supply
    },
    deleteElectricitySupply(supply: ElectricitySupply) {
      console.log("delete electricity supply", supply);
      // TODO: delete electricity supply
    },
    updateWaterSupply(water: string) {
      console.log("update water", water);
      // TODO: update water supply
    },
  },
});
</script>
