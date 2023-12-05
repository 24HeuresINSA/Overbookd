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
        <div v-if="canReviewGears" class="review">
          <v-btn
            class="review__action"
            fab
            x-small
            color="success"
            :disabled="cantApproveGears"
            @click="approved(MATOS)"
          >
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
          <v-btn
            class="review__action"
            fab
            x-small
            color="error"
            :disabled="cantRejectGears"
            @click="rejected(MATOS)"
          >
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
        <div v-if="canReviewElec" class="review">
          <v-btn
            class="review__action"
            fab
            x-small
            color="success"
            :disabled="cantApproveElec"
            @click="approved(ELEC)"
          >
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
          <v-btn
            class="review__action"
            fab
            x-small
            color="error"
            :disabled="cantRejectElec"
            @click="rejected(ELEC)"
          >
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
        <div v-if="canReviewBarriers" class="review">
          <v-btn
            class="review__action"
            fab
            x-small
            color="success"
            :disabled="cantApproveBarriers"
            @click="approved(BARRIERES)"
          >
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
          <v-btn
            class="review__action"
            fab
            x-small
            color="error"
            :disabled="cantRejectBarriers"
            @click="rejected(BARRIERES)"
          >
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
import FaInitInquiry from "~/components/molecules/festival-event/logistic/inquiry/FaInitInquiry.vue";
import FaDefaultInquiry from "~/components/molecules/festival-event/logistic/inquiry/FaDefaultInquiry.vue";
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
  REJECTED,
} from "@overbookd/festival-activity";

export default defineComponent({
  name: "FaInquiryCard",
  components: {
    FaInitInquiry,
    FaDefaultInquiry,
  },
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    inquiry(): FestivalActivity["inquiry"] {
      return this.mFA.inquiry;
    },
    allInquiryRequests(): InquiryRequest[] {
      return [
        ...this.inquiry.barriers,
        ...this.inquiry.electricity,
        ...this.inquiry.gears,
      ];
    },
    hasInquiry(): boolean {
      return (
        this.allInquiryRequests.length > 0 &&
        this.inquiry.timeWindows.length > 0
      );
    },
    shouldShowInitInquiry(): boolean {
      return !isDraft(this.mFA) && !this.hasInquiry;
    },
    canReviewGears(): boolean {
      return this.$accessor.user.isMemberOf(MATOS);
    },
    canReviewElec(): boolean {
      return this.$accessor.user.isMemberOf(ELEC);
    },
    canReviewBarriers(): boolean {
      return this.$accessor.user.isMemberOf(BARRIERES);
    },
    cantApproveGears(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.matos === APPROVED;
    },
    cantRejectGears(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.matos === REJECTED;
    },
    cantApproveElec(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.elec === APPROVED;
    },
    cantRejectElec(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.elec === REJECTED;
    },
    cantApproveBarriers(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.barrieres === APPROVED;
    },
    cantRejectBarriers(): boolean {
      if (isDraft(this.mFA)) return true;

      return this.mFA.reviews.barrieres === REJECTED;
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
    rejected(owner: InquiryOwner) {
      const reason = `Section demande de matos pour ${owner} non valide`;
      const rejection = { team: owner, reason };
      this.$accessor.festivalActivity.rejectBecause(rejection);
    },
  },
});
</script>
