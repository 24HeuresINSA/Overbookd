<template>
  <v-card>
    <v-card-title>Demande de matos</v-card-title>
    <v-card-text>
      <SearchGear v-model="gear" />
      <v-form class="inquiry-form">
        <v-text-field
          v-model="quantity"
          type="number"
          label="Quantité"
          :rules="[rules.number, rules.min]"
        />
        <SearchGear v-model="gear" />
        <v-btn
          rounded
          class="inquiry-form__btn"
          :disabled="!canAddInquiry"
          @click="addInquiry"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-form>

      <InquiryTable
        :inquiries="inquiry.gears"
        :owner="MATOS"
        @delete="deleteInquiry"
      />
      <InquiryTable
        :inquiries="inquiry.electricity"
        :owner="ELEC"
        @delete="deleteInquiry"
      />
      <InquiryTable
        :inquiries="inquiry.barriers"
        :owner="BARRIERES"
        @delete="deleteInquiry"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import SearchGear from "~/components/atoms/field/search/SearchGear.vue";
import {
  FestivalActivity,
  InquiryRequest,
  MATOS,
  ELEC,
  BARRIERES,
} from "@overbookd/festival-activity";
import { Gear } from "~/utils/models/catalog.model";
import { InputRulesData } from "~/utils/rules/input.rules";
import { min, isNumber } from "~/utils/rules/input.rules";

type FaInquiryCardData = InputRulesData & {
  gear?: Gear;
  quantity: number;

  MATOS: typeof MATOS;
  ELEC: typeof ELEC;
  BARRIERES: typeof BARRIERES;
};

export default defineComponent({
  name: "FaInquiryCard",
  components: { InquiryTable, SearchGear },
  data: (): FaInquiryCardData => ({
    gear: undefined,
    quantity: 1,

    MATOS,
    ELEC,
    BARRIERES,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    inquiry(): FestivalActivity["inquiry"] {
      return this.$accessor.festivalActivity.selectedActivity.inquiry;
    },
    canAddInquiry(): boolean {
      return this.gear !== undefined && this.quantity > 0;
    },
  },
  methods: {
    clearInquiryForm() {
      this.gear = undefined;
      this.quantity = 1;
    },
    addInquiry() {
      if (!this.canAddInquiry) return;
      const inquiry = {
        slug: this.gear?.slug,
        name: this.gear?.name,
        quantity: this.quantity,
        owner: this.gear?.owner?.code,
      };
      console.log("add inquiry", inquiry);
      // TODO: add inquiry
      this.clearInquiryForm();
    },
    deleteInquiry(inquiry: InquiryRequest) {
      console.log("delete inquiry", inquiry);
      // TODO: delete inquiry
    },
  },
});
</script>

<style lang="scss" scoped>
.inquiry-form {
  display: flex;
  align-items: center;
  gap: 1rem;
  &__btn {
    margin-left: 20px;
    margin-bottom: 30px;
  }
}
</style>
