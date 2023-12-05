<template>
  <v-card>
    <v-card-title>Demande de matos</v-card-title>
    <v-card-text>
      <FaTimeWindowTable
        :time-windows="inquiry.timeWindows"
        @add="addTimeWindow"
        @remove="removeTimeWindow"
      />

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
          color="primary"
          class="inquiry-form__btn"
          :disabled="!canAddInquiry"
          @click="addInquiry"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-form>

      <v-card class="inquiry-table">
        <div v-if="canReview" class="review">
          <v-btn
            class="review__action"
            fab
            x-small
            color="success"
            @click="approved(MATOS)"
            :disabled="cantApproveGears"
          >
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
          <v-btn class="review__action" fab x-small color="error">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
        </div>
        <v-card-title class="inquiry-table__title">Matos</v-card-title>
        <InquiryTable
          :inquiries="inquiry.gears"
          :owner="MATOS"
          @remove="removeInquiry"
        />
      </v-card>

      <v-card class="inquiry-table">
        <div v-if="canReview" class="review">
          <v-btn
            class="review__action"
            fab
            x-small
            color="success"
            @click="approved(ELEC)"
            :disabled="cantApproveElec"
          >
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
          <v-btn class="review__action" fab x-small color="error">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
        </div>
        <v-card-title class="inquiry-table__title">Elec</v-card-title>
        <InquiryTable
          :inquiries="inquiry.electricity"
          :owner="ELEC"
          @remove="removeInquiry"
        />
      </v-card>

      <v-card class="inquiry-table">
        <div v-if="canReview" class="review">
          <v-btn
            class="review__action"
            fab
            x-small
            color="success"
            @click="approved(BARRIERES)"
            :disabled="cantApproveBarriers"
          >
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
          <v-btn class="review__action" fab x-small color="error">
            <v-icon>mdi-close-circle-outline</v-icon>
          </v-btn>
        </div>
        <v-card-title class="inquiry-table__title">Barrières</v-card-title>
        <InquiryTable
          :inquiries="inquiry.barriers"
          :owner="BARRIERES"
          @remove="removeInquiry"
        />
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import SearchGear from "~/components/atoms/field/search/SearchGear.vue";
import {
  FestivalActivity,
  InquiryRequest,
  MATOS,
  ELEC,
  BARRIERES,
  TimeWindow,
  InquiryOwner,
  isDraft,
  APPROVED,
} from "@overbookd/festival-activity";
import { Gear } from "~/utils/models/catalog.model";
import { InputRulesData } from "~/utils/rules/input.rules";
import { min, isNumber } from "~/utils/rules/input.rules";
import { IProvidePeriod } from "@overbookd/period";

type FaInquiryCardData = InputRulesData & {
  gear: Gear | null;
  quantity: number;

  MATOS: typeof MATOS;
  ELEC: typeof ELEC;
  BARRIERES: typeof BARRIERES;
};

export default defineComponent({
  name: "FaInquiryCard",
  components: { InquiryTable, SearchGear, FaTimeWindowTable },
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
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    inquiry(): FestivalActivity["inquiry"] {
      return this.mFA.inquiry;
    },
    canAddInquiry(): boolean {
      return this.gear !== null && this.quantity > 0;
    },
    canReview(): boolean {
      return this.$accessor.user.can("manage-admins");
    },
    cantApproveGears(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.matos === APPROVED;
    },
    cantApproveElec(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.elec === APPROVED;
    },
    cantApproveBarriers(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.barrieres === APPROVED;
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
        slug: this.gear?.slug ?? "",
        quantity: +this.quantity,
      };
      this.$accessor.festivalActivity.addInquiryRequest(inquiry);
      this.clearInquiryForm();
    },
    removeInquiry(inquiry: InquiryRequest) {
      this.$accessor.festivalActivity.removeInquiryRequest(inquiry.slug);
    },
    addTimeWindow(period: IProvidePeriod) {
      this.$accessor.festivalActivity.addInquiryTimeWindow(period);
    },
    removeTimeWindow(timeWindow: TimeWindow) {
      this.$accessor.festivalActivity.removeInquiryTimeWindow(timeWindow.id);
    },
    approved(owner: InquiryOwner) {
      this.$accessor.festivalActivity.approveAs(owner);
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
  margin: 15px 0 30px 0;
  padding: 5px;
  &__title {
    font-size: 1.1rem;
  }
}

.review {
  position: relative;
  height: 0;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: flex-end;
  align-items: flex-start;
}
</style>
