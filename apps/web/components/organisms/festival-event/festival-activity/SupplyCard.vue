<template>
  <v-card>
    <div v-if="canReview" class="review">
      <v-btn class="review__action" fab x-small color="success">
        <v-icon>mdi-check-circle-outline</v-icon>
      </v-btn>
      <v-btn class="review__action" fab x-small color="error">
        <v-icon>mdi-close-circle-outline</v-icon>
      </v-btn>
    </div>
    <v-card-title>Besoin en électricité et eau</v-card-title>
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
        @remove="removeElectricitySupply"
      />

      <v-text-field
        :value="supply.water"
        label="Besoin en eau"
        @change="updateWaterSupply"
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
  PrepareElectricitySupplyCreation,
} from "@overbookd/festival-activity";

export default defineComponent({
  name: "SupplyCard",
  components: { ElectricitySupplyTable },
  computed: {
    supply(): FestivalActivity["supply"] {
      return this.$accessor.festivalActivity.selectedActivity.supply;
    },
    canReview(): boolean {
      return this.$accessor.user.can("manage-admins");
    },
  },
  methods: {
    addElectricitySupply(supply: PrepareElectricitySupplyCreation) {
      this.$accessor.festivalActivity.addElectricitySupply(supply);
    },
    updateElectricitySupply(supply: ElectricitySupply) {
      this.$accessor.festivalActivity.updateElectricitySupply(supply);
    },
    removeElectricitySupply(supply: ElectricitySupply) {
      this.$accessor.festivalActivity.removeElectricitySupply(supply.id);
    },
    updateWaterSupply(canBeEmpty: string) {
      const water = canBeEmpty.trim() ? canBeEmpty : null;
      this.$accessor.festivalActivity.updateSupply({ water });
    },
  },
});
</script>

<style lang="scss" scoped>
.review {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
