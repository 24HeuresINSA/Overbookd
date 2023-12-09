<template>
  <div class="fa-content fa">
    <FestivalEventSidebar festival-event="FA" class="sidebar" />
    <article class="container fa">
      <FaGeneralCard id="general" @reject="askReject" />
      <FaInChargeCard id="in-charge" @reject="askReject" />
      <SignaCard id="signa" @reject="askReject" />
      <SecurityCard id="security" @reject="askReject" />
      <SupplyCard id="supply" @reject="askReject" />
      <FaInquiryCard id="inquiry" @reject="askReject" />
      <FaFeedbackCard id="feedback" />
      <v-dialog v-model="isRejectDialogOpen" max-width="600">
        <AskRejectReasonFormCard
          @close-dialog="closeRejectDialog"
          @rejected="rejected"
        />
      </v-dialog>
    </article>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FestivalActivity, Reviewer } from "@overbookd/festival-activity";
import FestivalEventSidebar from "~/components/organisms/festival-event/FestivalEventSidebar.vue";
import FaGeneralCard from "~/components/organisms/festival-event/festival-activity/FaGeneralCard.vue";
import FaInChargeCard from "~/components/organisms/festival-event/festival-activity/FaInChargeCard.vue";
import SignaCard from "~/components/organisms/festival-event/festival-activity/SignaCard.vue";
import SecurityCard from "~/components/organisms/festival-event/festival-activity/SecurityCard.vue";
import SupplyCard from "~/components/organisms/festival-event/festival-activity/SupplyCard.vue";
import FaInquiryCard from "~/components/organisms/festival-event/festival-activity/FaInquiryCard.vue";
import FaFeedbackCard from "~/components/organisms/festival-event/festival-activity/FaFeedbackCard.vue";
import AskRejectReasonFormCard from "~/components/molecules/festival-event/review/AskRejectReasonFormCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

type FestivalActivityDetailsData = {
  isRejectDialogOpen: boolean;
  reviewer?: Reviewer;
};

export default defineComponent({
  name: "Fa",
  components: {
    FestivalEventSidebar,
    FaGeneralCard,
    FaInChargeCard,
    SignaCard,
    SecurityCard,
    SupplyCard,
    FaInquiryCard,
    FaFeedbackCard,
    SnackNotificationContainer,
    AskRejectReasonFormCard,
  },
  data: (): FestivalActivityDetailsData => ({
    isRejectDialogOpen: false,
    reviewer: undefined,
  }),
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    faId(): number {
      return +this.$route.params.faId;
    },
  },

  async mounted() {
    await this.$accessor.festivalActivity.fetchActivity(this.faId);
    if (this.mFA.id !== this.faId) {
      this.$accessor.notif.pushNotification({
        message: "Oups 😬 J'ai l'impression que cette FA n'existe pas...",
      });
      this.$router.push({ path: "/fa" });
    }
    document.title = `FA ${this.faId} - ${this.mFA.general.name}`;
  },
  methods: {
    closeRejectDialog() {
      this.isRejectDialogOpen = false;
    },
    askReject(team: Reviewer) {
      this.reviewer = team;
      this.isRejectDialogOpen = true;
    },
    rejected({ reason }: { reason: string }) {
      const team = this.reviewer;
      if (!team) return;
      this.$accessor.festivalActivity.rejectBecause({ team, reason });
    },
  },
});
</script>

<style lang="scss" scoped>
$sidebar-width: 350px;

.fa-content {
  display: flex;
  height: calc(100vh - #{$header-height} - #{$footer-height});
  overflow: auto;
  scroll-behavior: smooth;
}

.sidebar {
  position: fixed;
  width: $sidebar-width;
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-width: calc(100vw - #{$sidebar-width} - 90px);
  padding: 12px;
  margin-left: $sidebar-width;
  gap: 20px;
}

@media only screen and (max-width: $mobile-max-width) {
  .fa-content {
    flex-direction: column;
    overflow-y: scroll;
    height: auto;
  }

  .sidebar {
    position: relative;
    width: 100%;
    margin: unset;
    margin-bottom: 20px;
  }

  .container {
    overflow: visible;
    margin: unset;
    padding: unset;
  }
}
</style>
