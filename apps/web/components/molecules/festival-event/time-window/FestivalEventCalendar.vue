<template>
  <div>
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="previousPage()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer class="calendar-title">
        <div>
          {{ calendarTitle }}
        </div>
      </v-spacer>
      <v-btn icon class="ma-2" @click="nextPage()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-calendar
      ref="formCalendar"
      v-model="value"
      :type="calendarType"
      :events="calendarTimeWindows"
      :event-color="getEventColor"
      :event-ripple="false"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      :short-weekdays="false"
      @click:event="viewEvent"
    ></v-calendar>
    <v-dialog v-model="displayTimeSpanDetailsDialog" width="1000px">
      <FtTimeSpanDetails @close-dialog="closeTimeSpanDetailsDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FtTimeSpanDetails from "~/components/organisms/festival-event/festival-task/FtTimeSpanDetails.vue";
import { VuetifyCalendar } from "~/utils/calendar/vuetify-calendar";
import { formatDateWithExplicitMonth } from "~/utils/date/date.utils";
import { CalendarEvent } from "~/utils/models/calendar.model";
import { FtStatus, FtTimeWindow } from "~/utils/models/ft.model";

type Event = CalendarEvent & {
  timeSpanId?: number;
};

export default Vue.extend({
  name: "FestivalEventCalendar",
  components: {
    FtTimeSpanDetails,
  },
  props: {
    festivalEvent: {
      type: String,
      default: () => "FA",
    },
  },
  data: () => ({
    value: new Date(),
    displayTimeSpanDetailsDialog: false,
  }),
  computed: {
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    calendarType(): string {
      return window.screen.width < 750 ? "day" : "week";
    },
    calendarTitle(): string {
      return formatDateWithExplicitMonth(this.value);
    },
    calendarTimeWindows(): Event[] {
      return this.festivalEvent === "FA" ? this.faTimeWindows : this.ftEvents;
    },
    faTimeWindows(): CalendarEvent[] {
      const animationTimeWindows: CalendarEvent[] = (
        this.$accessor.fa.mFA.timeWindows ?? []
      ).map((timeWindow) => ({
        start: timeWindow.start,
        end: timeWindow.end,
        timed: true,
        color: "primary",
        name: "Tenue de l'animation",
      }));

      const gearTimeWindows: CalendarEvent[] =
        this.$accessor.fa.gearRequestRentalPeriods.map(
          (gearRequestRentalPeriod) => ({
            start: gearRequestRentalPeriod.start,
            end: gearRequestRentalPeriod.end,
            timed: true,
            color: "secondary",
            name: "Utilisation du matos",
          }),
        );

      return [...animationTimeWindows, ...gearTimeWindows];
    },
    ftEvents(): Event[] {
      const timeWindows = this.$accessor.ft.mFT.timeWindows ?? [];
      if (this.$accessor.ft.mFT.status !== FtStatus.READY) {
        return timeWindows.map(({ start, end }) => ({
          start,
          end,
          timed: true,
          color: "primary",
          name: "Tâche",
        }));
      }
      return this.getTimeSpanEvents(timeWindows);
    },
  },
  watch: {
    calendarTimeWindows(newVal: Event[], oldVal: Event[]) {
      if (oldVal.length > 0) return;
      const firstDate = newVal.at(0)?.start;
      if (firstDate) this.value = firstDate;
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.value = this.manifDate;
  },
  methods: {
    getEventColor(event: { color: string }): string {
      return event.color;
    },
    previousPage() {
      const calendar = this.$refs.formCalendar as unknown as VuetifyCalendar;
      if (calendar) calendar.prev();
    },
    nextPage() {
      const calendar = this.$refs.formCalendar as unknown as VuetifyCalendar;
      if (calendar) calendar.next();
    },
    viewEvent({ event }: { event: { timeSpanId?: number } }) {
      if (!event.timeSpanId) return;
      this.$accessor.assignment.fetchTimeSpanDetails(event.timeSpanId);
      this.displayTimeSpanDetailsDialog = true;
    },
    getTimeSpanEvents(timeWindows: FtTimeWindow[]): Event[] {
      return timeWindows.flatMap(({ timeSpans }) =>
        timeSpans.map(({ id, start, end }) => ({
          timeSpanId: id,
          start,
          end,
          timed: true,
          color: "purple",
          name: "Tâche",
        })),
      );
    },
    closeTimeSpanDetailsDialog() {
      this.displayTimeSpanDetailsDialog = false;
    },
  },
});
</script>

<style scoped>
.calendar-title {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  font-weight: 500;
}
</style>
