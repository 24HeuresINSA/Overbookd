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
        <FTLogisticsTable :is-disabled="isValidatedByMatos" />
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchGear from "~/components/atoms/field/search/SearchGear.vue";
import FTLogisticsTable from "~/components/molecules/festivalEvent/logistic/FTLogisticsTable.vue";
import {
  getFTValidationStatus,
  isTaskValidatedBy,
} from "~/utils/festivalEvent/ftUtils";
import { Gear } from "~/utils/models/catalog.model";
import { Ft } from "~/utils/models/ft";
import { isNumber, min } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "FTLogisticsCard",
  components: { FTLogisticsTable, SearchGear },
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
    mFT(): Ft {
      return this.$accessor.ft.mFT;
    },
    isValid(): boolean {
      return Boolean(
        this.gear &&
          parseInt(this.quantity) >= 1 &&
          this.$accessor.ft.gearRequestRentalPeriods.length > 0 &&
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
      const gearRequestCreation = {
        gearId: this.gear.id,
        quantity: parseInt(this.quantity, 10),
      };
      if (this.gear.isConsumable) {
        return this.$accessor.ft.addConsumableGearRequestForAllRentalPeriods(
          gearRequestCreation
        );
      }
      return this.$accessor.ft.addGearRequestForAllRentalPeriods(
        gearRequestCreation
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  .margin-btn {
    margin-left: 20px;
    margin-bottom: 30px;
  }
}
</style>
