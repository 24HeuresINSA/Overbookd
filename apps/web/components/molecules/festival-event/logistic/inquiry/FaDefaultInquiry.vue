<template>
  <div>
    <FaTimeWindowTable
      :time-windows="inquiry.timeWindows"
      @add="addTimeWindow"
      @remove="removeTimeWindow"
    />

    <FaInquiryForm @add="addInquiry" />

    <v-card class="inquiry-table">
      <div v-if="canReview" class="review">
        <v-btn class="review__action" fab x-small color="success">
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
        <v-btn class="review__action" fab x-small color="success">
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
        <v-btn class="review__action" fab x-small color="success">
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InquiryTable from "~/components/molecules/festival-event/logistic/inquiry/InquiryTable.vue";
import FaTimeWindowTable from "~/components/molecules/festival-event/time-window/FaTimeWindowTable.vue";
import {
  FestivalActivity,
  InquiryRequest,
  MATOS,
  ELEC,
  BARRIERES,
  TimeWindow,
} from "@overbookd/festival-activity";
import { IProvidePeriod } from "@overbookd/period";
import FaInquiryForm from "./FaInquiryForm.vue";
import { AddInquiryRequest } from "@overbookd/http";

type FaInquiryCardData = {
  MATOS: typeof MATOS;
  ELEC: typeof ELEC;
  BARRIERES: typeof BARRIERES;
};

export default defineComponent({
  name: "FaInquiryCard",
  components: { InquiryTable, FaTimeWindowTable, FaInquiryForm },
  data: (): FaInquiryCardData => ({
    MATOS,
    ELEC,
    BARRIERES,
  }),
  computed: {
    inquiry(): FestivalActivity["inquiry"] {
      return this.$accessor.festivalActivity.selectedActivity.inquiry;
    },
    canReview(): boolean {
      return this.$accessor.user.can("manage-admins");
    },
  },
  methods: {
    addInquiry(inquiry: AddInquiryRequest) {
      this.$accessor.festivalActivity.addInquiryRequest(inquiry);
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
  },
});
</script>

<style lang="scss" scoped>
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
