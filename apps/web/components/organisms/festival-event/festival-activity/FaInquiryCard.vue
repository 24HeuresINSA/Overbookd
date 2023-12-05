<template>
  <v-card>
    <v-card-title>Demande de matos</v-card-title>
    <v-card-text>
      <FaInitInquiry v-if="shouldShowInitInquiry" />
      <FaDefaultInquiry v-else />
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
  isDraft,
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
    canReview(): boolean {
      return this.$accessor.user.can("manage-admins");
    },
  },
});
</script>
