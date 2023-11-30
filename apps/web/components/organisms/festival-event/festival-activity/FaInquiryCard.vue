<template>
  <v-card>
    <v-card-title>Demande de matos</v-card-title>
    <v-card-text>
      <v-form class="inquiry-form">
        <v-text-field
          v-model="quantity"
          type="number"
          label="Quantité"
          :rules="[rules.number, rules.min]"
          class="inquiry-form__quantity"
        />
        <SearchGear v-model="gear" class="inquiry-form__search" />
        <v-btn
          rounded
          class="inquiry-form__btn"
          :disabled="!canAddInquiry"
          @click="addInquiry"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-form>

      <div class="inquiry-table">
        <h2>Matos</h2>
        <InquiryTable
          :inquiries="inquiry.gears"
          :owner="MATOS"
          @delete="deleteInquiry"
        />
      </div>

      <div class="inquiry-table">
        <h2>Elec</h2>
        <InquiryTable
          :inquiries="inquiry.electricity"
          :owner="ELEC"
          @delete="deleteInquiry"
        />
      </div>

      <div class="inquiry-table">
        <h2>Barrières</h2>
        <InquiryTable
          :inquiries="inquiry.barriers"
          :owner="BARRIERES"
          @delete="deleteInquiry"
        />
      </div>
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
  gear: Gear | null;
  quantity: number;

  MATOS: typeof MATOS;
  ELEC: typeof ELEC;
  BARRIERES: typeof BARRIERES;
};

export default defineComponent({
  name: "FaInquiryCard",
  components: { InquiryTable, SearchGear },
  data: (): FaInquiryCardData => ({
    gear: null,
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
      return this.gear !== null && this.quantity > 0;
    },
  },
  methods: {
    clearInquiryForm() {
      this.gear = null;
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
  gap: 1em;
  margin-bottom: 0;
  &__btn {
    margin-left: 20px;
    margin-bottom: 30px;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    gap: 0.2em;
    margin-bottom: 30px;
    &__quantity,
    &__search {
      width: 100%;
    }
    &__btn {
      margin: 0;
      width: 100%;
    }
  }
}

.inquiry-table {
  margin: 15px 0;
  h2 {
    font-size: 1rem;
    margin-bottom: 5px;
  }
}
</style>
