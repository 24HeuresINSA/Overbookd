<template>
  <div>
    <p>Tu n'as pas de demande de matos et ta FA est en attente de relecture.</p>
    <v-btn color="primary" @click="openInitInquiryDialog">
      Ajouter une demande de matos
    </v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FestivalActivity } from "@overbookd/festival-activity";

type FaInitInquiryCardData = {
  isInitInquiryDialogOpen: boolean;
};

export default defineComponent({
  name: "FaInquiryCard",
  components: {},
  data: (): FaInitInquiryCardData => ({
    isInitInquiryDialogOpen: false,
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
    openInitInquiryDialog(): void {
      this.isInitInquiryDialogOpen = true;
    },
    closeInitInquiryDialog(): void {
      this.isInitInquiryDialogOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
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
