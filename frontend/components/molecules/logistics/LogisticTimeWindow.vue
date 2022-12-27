<template>
  <div>
    <v-card v-if="noGearPeriod" class="message warning-message">
      <v-card-title :disabled="isValidatedByOwners"
        >Créneau de matos</v-card-title
      >
      <v-card-subtitle
        >Vous ne pouvez pas ajouter du matos sans un créneau de type
        "MATOS"</v-card-subtitle
      >
      <v-card-actions>
        <v-btn href="#timeframe" text> Aller à la partie créneau </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else class="message info-message">
      <v-card-title :disabled="isValidatedByOwners"
        >Créneau de matos</v-card-title
      >
      <v-card-subtitle
        >Toutes les demandes de matos seront identiques pour tous les creneaux
        matos</v-card-subtitle
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
        <v-btn href="#timeframe" text> Aller a la partie creneau </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {
  getFAValidationStatus,
  isAnimationValidatedBy,
} from "~/utils/fa/faUtils";
import { FA, Period, Status } from "~/utils/models/FA";

export default Vue.extend({
  name: "LogisticTimeWindow",
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    isAddDialogOpen: false,
    isUpdateDialogOpen: false,
  }),
  computed: {
    gearRequestRentalPeriods(): Period[] {
      return this.$accessor.FA.gearRequestRentalPeriods;
    },
    noGearPeriod(): boolean {
      return this.gearRequestRentalPeriods.length === 0;
    },
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    isValidatedByOwners(): boolean {
      const byMatos = isAnimationValidatedBy(this.mFA, "matos");
      const byBarrieres = isAnimationValidatedBy(this.mFA, "barrieres");
      const byElec = isAnimationValidatedBy(this.mFA, "elec");

      return byMatos && byBarrieres && byElec;
    },
    validationStatus(): string {
      const logStatus = [
        getFAValidationStatus(this.mFA, "matos"),
        getFAValidationStatus(this.mFA, "barrieres"),
        getFAValidationStatus(this.mFA, "elec"),
      ];

      const areAllValidated = logStatus.every(
        (status) => status === Status.VALIDATED
      );
      if (areAllValidated) return Status.VALIDATED.toLowerCase();

      const areAllRefused = logStatus.every(
        (status) => status === Status.REFUSED
      );
      if (areAllRefused) return Status.REFUSED.toLowerCase();

      const hasAtLeastOneSubmitted = logStatus.some(
        (status) => status === Status.SUBMITTED
      );
      if (hasAtLeastOneSubmitted) return Status.SUBMITTED.toLowerCase();

      return Status.DRAFT.toLowerCase();
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

.v-card {
  &.message {
    border-width: 2px;
    border-style: solid;
  }
  &.warning-message {
    border-color: $warning-primary;
    background-color: $warning-secondary;
  }
  &.info-message {
    border-color: $info-primary;
    background-color: $info-secondary;
  }
}
</style>
