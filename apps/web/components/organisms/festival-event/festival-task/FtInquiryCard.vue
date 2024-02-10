<template>
  <v-card>
    <v-card-title> Demande de matos </v-card-title>

    <v-card-text>
      <v-form class="inquiry-form">
        <InquiryFormFields
          class="inquiry-form__fields"
          :gear="gear"
          :quantity="quantity"
          ponctual-usage
          @update:gear="updateGear"
          @update:quantity="updateQuantity"
        />
        <v-btn
          rounded
          color="primary"
          class="inquiry-form__btn"
          :disabled="!canAddInquiry"
          @click="addInquiry"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-form>

      <InquiryTable
        :inquiries="inquiries"
        :time-windows="timeWindows"
        :owner="MATOS"
        @remove="removeInquiry"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InquiryFormFields from "~/components/molecules/festival-event/logistic/inquiry/InquiryFormFields.vue";
import {
  FestivalTask,
  InquiryRequest,
  MATOS,
  TimeWindow,
} from "@overbookd/festival-event";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import { Gear } from "~/utils/models/catalog.model";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

type FtInquiryCardData = InputRulesData & {
  gear: Gear | null;
  quantity: number;
  MATOS: typeof MATOS;
};

export default defineComponent({
  name: "FtInquiryCard",
  components: { InquiryTable, InquiryFormFields },
  data: (): FtInquiryCardData => ({
    gear: null,
    quantity: 1,
    MATOS,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    inquiries(): FestivalTask["inquiries"] {
      return this.$accessor.festivalTask.selectedTask.inquiries;
    },
    timeWindows(): TimeWindow[] {
      return this.$accessor.festivalTask.selectedTask.mobilizations;
    },
    canAddInquiry(): boolean {
      return this.gear !== null && this.quantity > 0;
    },
  },
  methods: {
    addInquiry() {
      if (!this.canAddInquiry) return;
      const inquiry = {
        slug: this.gear?.slug ?? "",
        quantity: this.quantity,
      };
      this.$accessor.festivalTask.addInquiryRequest(inquiry);
      this.clearInquiryForm();
    },
    removeInquiry(inquiry: InquiryRequest) {
      this.$accessor.festivalTask.removeInquiryRequest(inquiry.slug);
    },
    updateGear(gear: Gear) {
      this.gear = gear;
    },
    updateQuantity(quantity: number) {
      this.quantity = quantity;
    },
    clearInquiryForm() {
      this.gear = null;
      this.quantity = 1;
    },
  },
});
</script>

<style lang="scss" scoped>
.inquiry-form {
  display: flex;
  align-items: center;
  gap: 1em;
  margin-top: 10px;
  margin-bottom: 0;
  &__fields {
    width: 100%;
  }
  &__btn {
    margin: 10px 0 30px 20px;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    gap: 0.2em;
    margin-bottom: 30px;
    &__btn {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
