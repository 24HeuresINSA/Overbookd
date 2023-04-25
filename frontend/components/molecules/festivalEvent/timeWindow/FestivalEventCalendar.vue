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
      type="week"
      :events="calendarTimeWindows"
      :event-color="getEventColor"
      :event-ripple="false"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      :short-weekdays="false"
      @click:event="viewEvent"
    ></v-calendar>
    <v-dialog v-model="displayTimespanDetailsDialog" width="1000px">
      <TimespanDetails @close-dialog="closeTimespanDetailsDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithExplicitMonth } from "~/utils/date/dateUtils";
import { CalendarItem } from "~/utils/models/calendar";
import { FTStatus, FTTimeWindow } from "~/utils/models/ft";
import TimespanDetails from "~/components/organisms/assignment/card/TimespanDetails.vue";

type Event = CalendarItem & {
  timespanId?: number;
};

export default Vue.extend({
  name: "FestivalEventCalendar",
  components: {
    TimespanDetails,
  },
  props: {
    festivalEvent: {
      type: String,
      default: () => "FA",
    },
  },
  data: () => ({
    value: new Date(),
    displayTimespanDetailsDialog: false,
  }),
  computed: {
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
    calendarTitle(): string {
      return formatDateWithExplicitMonth(this.value);
    },
    calendarTimeWindows(): Event[] {
      return this.festivalEvent === "FA" ? this.faTimeWindows : this.ftEvents;
    },
    faTimeWindows(): CalendarItem[] {
      const animationTimeWindows: CalendarItem[] = (
        this.$accessor.FA.mFA.time_windows ?? []
      ).map((timeWindow) => ({
        start: timeWindow.start,
        end: timeWindow.end,
        timed: true,
        color: "primary",
        name: "Tenue de l'animation",
      }));

      const gearTimeWindows: CalendarItem[] =
        this.$accessor.FA.gearRequestRentalPeriods.map(
          (gearRequestRentalPeriod) => ({
            start: gearRequestRentalPeriod.start,
            end: gearRequestRentalPeriod.end,
            timed: true,
            color: "secondary",
            name: "Utilisation du matos",
          })
        );

      return [...animationTimeWindows, ...gearTimeWindows];
    },
    ftEvents(): Event[] {
      const timeWindows = this.$accessor.FT.mFT.timeWindows ?? [];
      if (this.$accessor.FT.mFT.status !== FTStatus.READY) {
        return timeWindows.map(({ start, end }) => ({
          start,
          end,
          timed: true,
          color: "primary",
          name: "Tâche",
        }));
      }
      return this.getTimespanEvents(timeWindows);
    },
  },
  mounted() {
    this.value = this.manifDate;
  },
  methods: {
    getEventColor(event: any): string {
      return event.color;
    },
    previousPage() {
      const calendar = this.$refs.formCalendar;
      // @ts-ignore
      if (calendar) calendar.prev();
    },
    nextPage() {
      const calendar = this.$refs.formCalendar;
      // @ts-ignore
      if (calendar) calendar.next();
    },
    viewEvent({ event }: { event: { timespanId?: number } }) {
      if (!event.timespanId) return;
      this.$accessor.assignment.fetchTimespanDetails(event.timespanId);
      this.displayTimespanDetailsDialog = true;
    },
    getTimespanEvents(timeWindows: FTTimeWindow[]): Event[] {
      return timeWindows.flatMap(({ timespans }) =>
        timespans.map(({ id, start, end }) => ({
          timespanId: id,
          start,
          end,
          timed: true,
          color: "purple",
          name: "Tâche",
        }))
      );
    },
    closeTimespanDetailsDialog() {
      this.displayTimespanDetailsDialog = false;
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
