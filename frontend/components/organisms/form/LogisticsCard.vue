<template>
  <v-card :class="validationStatus">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-text>
      <v-container>
        <v-form v-if="!isValidatedByOwner" class="flex-row">
          <v-text-field
            v-model="quantity"
            type="number"
            label="Quantité"
            :rules="[rules.number, rules.min]"
          />
          <SearchGear
            :gear="gear"
            :owner="owner"
            :ponctual-usage="ponctualUsageGear"
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
        <LogisticsTable
          :owner="owner"
          :is-disabled="isValidatedByOwner"
        ></LogisticsTable>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchGear from "~/components/atoms/SearchGear.vue";
import LogisticsTable from "~/components/molecules/logistics/LogisticsTable.vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/festivalEvent/faUtils";
import { Gear } from "~/utils/models/catalog.model";
import { FA, time_windows, time_windows_type } from "~/utils/models/FA";
import { isNumber, min } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "LogisticsCard",
  components: { LogisticsTable, SearchGear },
  props: {
    title: {
      type: String,
      default: () => "",
    },
    owner: {
      type: String,
      default: () => "",
    },
    ponctualUsageGear: {
      type: Boolean,
      default: () => undefined,
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
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    isValid(): boolean {
      return Boolean(
        this.gear &&
          parseInt(this.quantity) >= 1 &&
          this.$accessor.FA.gearRequestRentalPeriods.length > 0 &&
          !this.isValidatedByOwner
      );
    },
    timeWindow(): time_windows | undefined {
      return this.$accessor.FA.mFA.time_windows?.find(
        (tw) => tw.type === time_windows_type.MATOS
      );
    },
    isValidatedByOwner(): boolean {
      return isAnimationValidatedBy(this.mFA, this.owner);
    },
    validationStatus(): string {
      return getFAValidationStatus(this.mFA, this.owner).toLowerCase();
    },
  },
  methods: {
    updateCurrentGear(gear: Gear | undefined) {
      this.gear = gear;
    },
    addGear() {
      if (!this.gear) return;
      return this.$accessor.FA.addGearRequestForAllRentalPeriods({
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
