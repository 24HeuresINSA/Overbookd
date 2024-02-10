<template>
  <div class="ft-content ft">
    <FestivalEventSidebar festival-event="FT" class="sidebar" />
    <v-container class="container ft">
      <FtGeneralCard id="general" />
      <ParentFaCard id="fa" />
      <FtInquiryCard id="inquiry" />
      <InstructionsCard id="instructions" />
      <MobilizationCard id="mobilization" />
      <FeedbackCard
        id="feedback"
        :key-events="keyEvents"
        @publish="publishFeedback"
      />
    </v-container>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FtGeneralCard from "~/components/organisms/festival-event/festival-task/FtGeneralCard.vue";
import InstructionsCard from "~/components/organisms/festival-event/festival-task/InstructionsCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import FestivalEventSidebar from "~/components/organisms/festival-event/FestivalEventSidebar.vue";
import FtInquiryCard from "~/components/organisms/festival-event/festival-task/FtInquiryCard.vue";
import ParentFaCard from "~/components/organisms/festival-event/festival-task/ParentFaCard.vue";
import MobilizationCard from "~/components/organisms/festival-event/festival-task/MobilizationCard.vue";
import FeedbackCard from "~/components/organisms/festival-event/FeedbackCard.vue";
import {
  COMMENTED,
  FestivalTask,
  FestivalTaskKeyEvent,
} from "@overbookd/festival-event";

export default defineComponent({
  components: {
    FestivalEventSidebar,
    SnackNotificationContainer,
    FtGeneralCard,
    InstructionsCard,
    FtInquiryCard,
    ParentFaCard,
    MobilizationCard,
    FeedbackCard,
  },
  computed: {
    selectedTask(): FestivalTask {
      return this.$accessor.festivalTask.selectedTask;
    },
    ftId(): number {
      return +this.$route.params.ftId;
    },
    keyEvents(): FestivalTaskKeyEvent[] {
      const feedbacksAsKeyEvent: FestivalTaskKeyEvent[] =
        this.selectedTask.feedbacks.map(({ author, publishedAt, content }) => ({
          at: publishedAt,
          description: content,
          by: author,
          action: COMMENTED,
        }));

      return [...feedbacksAsKeyEvent, ...this.selectedTask.history].toSorted(
        (first, second) => first.at.getTime() - second.at.getTime(),
      );
    },
  },
  async mounted() {
    await this.$accessor.festivalTask.fetchTask(this.ftId);
    if (this.selectedTask.id !== this.ftId) {
      this.$accessor.notif.pushNotification({
        message: "Oups 😬 J'ai l'impression que cette FT n'existe pas...",
      });
      this.$router.push({ path: "/ft" });
    }
    document.title = `FT ${this.ftId} - ${this.selectedTask.general.name}`;
  },
  methods: {
    publishFeedback(content: string) {
      this.$accessor.festivalTask.publishFeedback({ content });
    },
  },
});
</script>

<style lang="scss" scoped>
$sidebar-width: 350px;

.ft-content {
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
  .ft-content {
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
