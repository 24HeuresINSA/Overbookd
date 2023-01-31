<template>
  <v-card :class="validationStatus">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-container>
        <v-form v-if="!isValidatedByMatos" class="flex-row">
          <v-text-field
            v-model="quantity"
            type="number"
            label="Quantité"
            :rules="[rules.number, rules.min]"
          />
          <SearchGear
            :gear="gear"
            :ponctual-usage="true"
            @change="updateCurrentGear"
          ></SearchGear>
          <v-btn
            rounded
            class="margin-btn"
            :disabled="!isValid"
            @click="addGear"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-form>
        <LogisticsTableFT :is-disabled="isValidatedByMatos"></LogisticsTableFT>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchGear from "~/components/atoms/SearchGear.vue";
import LogisticsTableFT from "~/components/molecules/logistics/LogisticsTableFT.vue";
import {
  getFTValidationStatus,
  isTaskValidatedBy,
} from "~/utils/festivalEvent/ftUtils";
import { Gear } from "~/utils/models/catalog.model";
import { FT } from "~/utils/models/ft";
import { isNumber, min } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "LogisticsCardFT",
  components: { LogisticsTableFT, SearchGear },
  props: {
    title: {
      type: String,
      default: () => "",
    },
  },
  data: () => ({
    gear: undefined as Gear | undefined,
    quantity: "1",
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    isValid(): boolean {
      return Boolean(
        this.gear &&
          parseInt(this.quantity) >= 1 &&
          this.$accessor.FT.gearRequestRentalPeriods.length > 0 &&
          !this.isValidatedByMatos
      );
    },
    isValidatedByMatos(): boolean {
      return isTaskValidatedBy(this.mFT.reviews, "matos");
    },
    validationStatus(): string {
      return getFTValidationStatus(this.mFT, "matos").toLowerCase();
    },
  },
  methods: {
    updateCurrentGear(gear: Gear | undefined) {
      this.gear = gear;
    },
    addGear() {
      if (!this.gear) return;
      return this.$accessor.FT.addGearRequestForAllRentalPeriods({
        gearId: this.gear.id,
        quantity: parseInt(this.quantity, 10),
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.flex-row .margin-btn {
  margin-left: 20px;
  margin-bottom: 30px;
}
</style>
