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
          :disabled="disabled"
          @update:gear="updateGear"
          @update:quantity="updateQuantity"
        />
        <v-btn
          rounded
          color="primary"
          class="inquiry-form__btn"
          :disabled="!canAddInquiry || disabled"
          @click="addInquiry"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-form>

      <InquiryTable
        :inquiries="inquiries"
        :time-windows="timeWindows"
        :owner="MATOS"
        :disabled="disabled"
        @link-drive="linkDrive"
        @remove="removeInquiry"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InquiryFormFields from "~/components/molecules/festival-event/logistic/inquiry/InquiryFormFields.vue";
import {
  AssignDrive,
  FestivalTask,
  InquiryRequest,
  MATOS,
  TimeWindow,
} from "@overbookd/festival-event";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";
import { CatalogGear } from "@overbookd/http";

type FtInquiryCardData = InputRulesData & {
  gear: CatalogGear | null;
  quantity: number;
  MATOS: typeof MATOS;
};

export default defineComponent({
  name: "FtInquiryCard",
  components: { InquiryTable, InquiryFormFields },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
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
    selectedTask(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
    inquiries(): FestivalTask["inquiries"] {
      return this.selectedTask.inquiries;
    },
    timeWindows(): TimeWindow[] {
      return this.selectedTask.mobilizations;
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
    linkDrive(link: AssignDrive) {
      this.$accessor.festivalTask.linkDrive(link);
    },
    removeInquiry(inquiry: InquiryRequest) {
      this.$accessor.festivalTask.removeInquiryRequest(inquiry.slug);
    },
    updateGear(gear: CatalogGear) {
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
