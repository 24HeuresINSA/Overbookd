<template>
  <div>
    <v-card v-if="noGearPeriod" :class="validationStatus">
      <v-card-title>Créneau de matos</v-card-title>
      <v-card-subtitle
        >Vous ne pouvez pas ajouter du matos sans un créneau de type
        "MATOS"</v-card-subtitle
      >
      <v-card-actions>
        <v-btn v-show="!isValidatedByOwners" href="#timeframe" text>
          Aller à la partie créneau
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else :class="validationStatus">
      <v-card-title>Créneau de matos</v-card-title>
      <v-card-subtitle
        >Toutes les demandes de matos seront identiques pour tous les créneaux
        matos.</v-card-subtitle
      >
      <v-card-text>
        <div class="periods">
          <div
            v-for="period in gearRequestRentalPeriods"
            :key="period.id"
            class="period"
          >
            <v-chip color="primary">
              <span class="temporal">De</span>
              <span class="date">{{ displayDate(period.start) }}</span>
            </v-chip>
            <v-chip color="primary">
              <span class="temporal">A</span>
              <span class="date">{{ displayDate(period.end) }}</span>
            </v-chip>
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn v-show="!isValidatedByOwners" href="#timeframe" text>
          Aller à la partie créneau
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getFAValidationStatusWithMultipleTeams,
  hasAllValidations,
} from "~/utils/festivalEvent/faUtils";
import { FA, Period } from "~/utils/models/FA";

export default Vue.extend({
  name: "LogisticTimeWindow",
  data: () => ({
    owners: ["matos", "barrieres", "elec"],
    isAddDialogOpen: false,
    isUpdateDialogOpen: false,
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    gearRequestRentalPeriods(): Period[] {
      return this.$accessor.FA.gearRequestRentalPeriods;
    },
    noGearPeriod(): boolean {
      return this.gearRequestRentalPeriods.length === 0;
    },
    isValidatedByOwners(): boolean {
      return hasAllValidations(this.mFA, this.owners);
    },
    validationStatus(): string {
      return getFAValidationStatusWithMultipleTeams(
        this.mFA,
        this.owners
      ).toLowerCase();
    },
  },
  methods: {
    displayDate(date: Date): string {
      const displayOptions: Intl.DateTimeFormatOptions = {
        dateStyle: "long",
        timeStyle: "short",
      };
      return new Intl.DateTimeFormat("fr", displayOptions).format(
        new Date(date)
      );
    },
  },
});
</script>

<style lang="scss">
.periods {
  display: flex;
  flex-direction: column;
  gap: 10px;
  .period {
    display: flex;
    gap: 30px;
    .temporal {
      font-weight: 600;
    }
    .date {
      margin-left: 5px;
    }
  }
}
</style>
