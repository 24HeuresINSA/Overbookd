<template>
  <v-card class="inquiry-card">
    <v-btn class="inquiry-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="inquiry-card__title">
      <h2>Initialiser une demande de matos</h2>
    </v-card-title>

    <v-card-text class="pb-0">
      <FaTimeWindowFormFields
        :start="start"
        :end="end"
        @update:start="updateStart"
        @update:end="updateEnd"
      />

      <h3>Matos</h3>
      <FaInquiryFormFields
        :gear="gear"
        :quantity="quantity"
        @update:gear="updateGear"
        @update:quantity="updateQuantity"
      />
    </v-card-text>

    <v-card-actions class="inquiry-card__actions">
      <v-btn
        :disabled="!canInitInquiry"
        color="primary"
        large
        @click="initInquiry"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Initialiser la demande de matos
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FaTimeWindowFormFields from "../../time-window/FaTimeWindowFormFields.vue";
import FaInquiryFormFields from "./FaInquiryFormFields.vue";
import { InitInquiryRequest } from "@overbookd/http";
import { IProvidePeriod, Period } from "@overbookd/period";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";
import { Gear } from "~/utils/models/catalog.model";

type FaInitInquiryCardData = InputRulesData &
  IProvidePeriod & {
    gear: Gear | null;
    quantity: number;
  };

export default defineComponent({
  name: "FaInitInquiryFormCard",
  components: { FaTimeWindowFormFields, FaInquiryFormFields },
  data: (): FaInitInquiryCardData => ({
    start: new Date(),
    end: new Date(),
    gear: null,
    quantity: 1,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    period(): IProvidePeriod {
      return {
        start: this.start,
        end: this.end,
      };
    },
    isPeriodValid(): boolean {
      return Period.isValid(this.period);
    },
    canAddInquiry(): boolean {
      return this.gear !== null && this.quantity > 0;
    },
    canInitInquiry(): boolean {
      return this.canAddInquiry && this.isPeriodValid;
    },
    eventStartDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.setDefaultDates();
  },
  methods: {
    initInquiry() {
      if (!this.canInitInquiry) return;

      const form: InitInquiryRequest = {
        timeWindow: this.period,
        request: {
          slug: this.gear?.slug ?? "",
          quantity: this.quantity,
        },
      };
      this.$accessor.festivalActivity.initInquiry(form);
      this.closeDialog();
    },
    setDefaultDates() {
      this.start = this.eventStartDate;
      this.end = this.eventStartDate;
    },
    updateStart(start: Date) {
      this.start = start;
    },
    updateEnd(end: Date) {
      this.end = end;
    },
    updateGear(gear: Gear) {
      this.gear = gear;
    },
    updateQuantity(quantity: number) {
      this.quantity = quantity;
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.inquiry-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
