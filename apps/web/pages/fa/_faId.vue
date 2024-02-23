<template>
  <div class="fa-content fa">
    <FestivalEventSidebar festival-event="FA" class="sidebar" />
    <article class="container fa">
      <FaGeneralCard
        id="general"
        @reject="askReject"
        @open:calendar="openCalendar"
      />
      <FaInChargeCard id="in-charge" @reject="askReject" />
      <SignaCard id="signa" @reject="askReject" />
      <SecurityCard id="security" @reject="askReject" />
      <SupplyCard id="supply" @reject="askReject" />
      <FaInquiryCard
        id="inquiry"
        @reject="askReject"
        @open:calendar="openCalendar"
      />
      <FeedbackCard
        id="feedback"
        :festival-event="selectedActivity"
        @publish="publishFeedback"
      />
      <ChildFtCard id="ft" />

      <v-dialog v-model="isRejectDialogOpen" max-width="600">
        <AskRejectReasonFormCard
          identifier="FA"
          @close-dialog="closeRejectDialog"
          @rejected="rejected"
        />
      </v-dialog>
      <v-dialog v-model="isCalendarDialogOpen" max-width="1000">
        <OverCalendar v-model="calendarMarker" :events="allTimeWindows" />
      </v-dialog>
    </article>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FestivalActivity, Reviewer } from "@overbookd/festival-event";
import FestivalEventSidebar from "~/components/organisms/festival-event/FestivalEventSidebar.vue";
import FaGeneralCard from "~/components/organisms/festival-event/festival-activity/FaGeneralCard.vue";
import FaInChargeCard from "~/components/organisms/festival-event/festival-activity/FaInChargeCard.vue";
import SignaCard from "~/components/organisms/festival-event/festival-activity/SignaCard.vue";
import SecurityCard from "~/components/organisms/festival-event/festival-activity/SecurityCard.vue";
import SupplyCard from "~/components/organisms/festival-event/festival-activity/SupplyCard.vue";
import FaInquiryCard from "~/components/organisms/festival-event/festival-activity/FaInquiryCard.vue";
import FeedbackCard from "~/components/organisms/festival-event/FeedbackCard.vue";
import AskRejectReasonFormCard from "~/components/molecules/festival-event/review/AskRejectReasonFormCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import { CalendarEvent } from "~/utils/models/calendar.model";
import ChildFtCard from "~/components/organisms/festival-event/festival-activity/ChildFtCard.vue";

type FestivalActivityDetailsData = {
  isRejectDialogOpen: boolean;
  isCalendarDialogOpen: boolean;
  reviewer?: Reviewer<"FA">;
  calendarMarker: Date;
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
    FeedbackCard,
    SnackNotificationContainer,
    AskRejectReasonFormCard,
    OverCalendar,
    ChildFtCard,
  },
  data: (): FestivalActivityDetailsData => ({
    isRejectDialogOpen: false,
    isCalendarDialogOpen: false,
    reviewer: undefined,
    calendarMarker: new Date(),
  }),
  computed: {
    selectedActivity(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    faId(): number {
      return +this.$route.params.faId;
    },
    eventStartDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    calendarStartDate(): Date {
      const startTimestamps = [
        ...this.selectedActivity.general.timeWindows,
        ...this.selectedActivity.inquiry.timeWindows,
      ].map(({ start }) => start.getTime());
      if (startTimestamps.length === 0) return this.eventStartDate;

      const minStart = Math.min(...startTimestamps);
      return new Date(minStart);
    },
    allTimeWindows(): CalendarEvent[] {
      const inquiryEvents: CalendarEvent[] =
        this.selectedActivity.inquiry.timeWindows.map(({ start, end }) => ({
          start,
          end,
          name: "Créneau matos",
          timed: true,
          color: "grey",
        }));
      const generalEvents: CalendarEvent[] =
        this.selectedActivity.general.timeWindows.map(({ start, end }) => ({
          start,
          end,
          name: "Créneau animation",
          timed: true,
          color: "blue",
        }));
      return [...inquiryEvents, ...generalEvents];
    },
  },

  async mounted() {
    await this.$accessor.festivalActivity.fetchActivity(this.faId);
    if (this.selectedActivity.id !== this.faId) {
      this.$accessor.notif.pushNotification({
        message: "Oups 😬 J'ai l'impression que cette FA n'existe pas...",
      });
      this.$router.push({ path: "/fa" });
    }
    document.title = `FA ${this.faId} - ${this.selectedActivity.general.name}`;
    this.calendarMarker = this.calendarStartDate;
  },
  methods: {
    closeRejectDialog() {
      this.isRejectDialogOpen = false;
    },
    openCalendar() {
      this.isCalendarDialogOpen = true;
    },
    askReject(team: Reviewer<"FA">) {
      this.reviewer = team;
      this.isRejectDialogOpen = true;
    },
    rejected({ reason }: { reason: string }) {
      const team = this.reviewer;
      if (!team) return;
      this.$accessor.festivalActivity.rejectBecause({ team, reason });
    },
    publishFeedback(content: string) {
      this.$accessor.festivalActivity.publishFeedback({ content });
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
