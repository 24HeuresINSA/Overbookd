<template>
  <div class="fa-content fa">
    <FestivalEventSidebar festival-event="FA" class="sidebar" />
    <article class="container fa">
      <FaGeneralCard id="general" />
      <FaInChargeCard id="in-charge" />
      <SignaCard id="signa" />
      <SecurityCard id="security" />
      <SupplyCard id="supply" />
      <FaInquiryCard id="inquiry" />
      <FaFeedbackCard id="feedback" />
    </article>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FestivalActivity } from "@overbookd/festival-activity";
import FestivalEventSidebar from "~/components/organisms/festival-event/FestivalEventSidebar.vue";
import FaGeneralCard from "~/components/organisms/festival-event/festival-activity/FaGeneralCard.vue";
import FaInChargeCard from "~/components/organisms/festival-event/festival-activity/FaInChargeCard.vue";
import SignaCard from "~/components/organisms/festival-event/festival-activity/SignaCard.vue";
import SecurityCard from "~/components/organisms/festival-event/festival-activity/SecurityCard.vue";
import SupplyCard from "~/components/organisms/festival-event/festival-activity/SupplyCard.vue";
import FaInquiryCard from "~/components/organisms/festival-event/festival-activity/FaInquiryCard.vue";
import FaFeedbackCard from "~/components/organisms/festival-event/festival-activity/FaFeedbackCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

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
  },

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
  }

  .container {
    overflow: visible;
    margin: unset;
    padding: unset;
  }
}
</style>
