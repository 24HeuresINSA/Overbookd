<template>
  <div>
    <div class="filters">
      <v-btn
        id="mobilizations-or-assignments"
        :color="mobilizationsOrAssignmentsColor"
        :outlined="!displayMobilizationsOrAssignments"
        @click="toggleDisplay('mobilizations-or-assignments')"
      >
        {{ mobilizationsOrAssignmentsLabel }}
      </v-btn>
      <v-btn
        id="activity-time-windows"
        color="blue"
        :outlined="!displayActivityTimeWindows"
        @click="toggleDisplay('activity-time-windows')"
      >
        Créneaux Animation
      </v-btn>
      <v-btn
        id="activity-inquiries"
        color="grey"
        :outlined="!displayActivityInquiries"
        @click="toggleDisplay('activity-inquiries')"
      >
        Créneaux Matos de l'Animation
      </v-btn>
    </div>
    <OverCalendar v-model="calendarMarker" :events="allEvents" />
  </div>
</template>

<script lang="ts">
import {
  FestivalTask,
  FestivalTaskReadyToAssign,
  isReadyToAssign,
} from "@overbookd/festival-event";
import { defineComponent } from "vue";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import { ORANGE, PURPLE } from "~/domain/common/status-color";
import { CalendarEvent } from "~/utils/models/calendar.model";

type FestivalTaskCalendarData = {
  displayMobilizationsOrAssignments: boolean;
  displayActivityTimeWindows: boolean;
  displayActivityInquiries: boolean;
  calendarMarker: Date;
};

type DisplayableEvent =
  | "mobilizations-or-assignments"
  | "activity-time-windows"
  | "activity-inquiries";

export default defineComponent({
  name: "FestivalTaskCalendar",
  components: { OverCalendar },
  props: {
    task: {
      type: Object as () => FestivalTask,
      required: true,
    },
  },
  data: (): FestivalTaskCalendarData => ({
    displayMobilizationsOrAssignments: true,
    displayActivityInquiries: false,
    displayActivityTimeWindows: false,
    calendarMarker: new Date(),
  }),
  computed: {
    eventStartDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    calendarStartDate(): Date {
      const startTimestamps = this.task.mobilizations.map(({ start }) =>
        start.getTime(),
      );
      if (startTimestamps.length === 0) return this.eventStartDate;

      const minStart = Math.min(...startTimestamps);
      return new Date(minStart);
    },
    mobilizationsOrAssignmentsLabel(): string {
      return isReadyToAssign(this.task) ? "Affectations" : "Mobilisations";
    },
    mobilizationsOrAssignmentsColor(): string {
      return isReadyToAssign(this.task) ? PURPLE : ORANGE;
    },
    mobilizationsOrAssignments(): CalendarEvent[] {
      if (!this.displayMobilizationsOrAssignments) return [];

      if (isReadyToAssign(this.task)) {
        return this.convertAssignmentsToCalendarEvent(this.task);
      }
      return this.convertMobilizationsToCalendarEvent(this.task);
    },
    activityInquiries(): CalendarEvent[] {
      if (!this.displayActivityInquiries) return [];
      return this.task.festivalActivity.inquiry.timeWindows.map(
        ({ start, end }): CalendarEvent => ({
          start,
          end,
          name: "Créneau matos de la FA",
          timed: true,
          color: "grey",
        }),
      );
    },
    activityTimeWindows(): CalendarEvent[] {
      if (!this.displayActivityTimeWindows) return [];
      const { name } = this.task.festivalActivity;
      return this.task.festivalActivity.timeWindows.map(
        ({ start, end }): CalendarEvent => ({
          start,
          end,
          name,
          timed: true,
          color: "blue",
        }),
      );
    },
    allEvents(): CalendarEvent[] {
      return [
        ...this.mobilizationsOrAssignments,
        ...this.activityInquiries,
        ...this.activityTimeWindows,
      ];
    },
  },
  mounted() {
    this.calendarMarker = this.calendarStartDate;
  },
  methods: {
    convertMobilizationsToCalendarEvent(task: FestivalTask): CalendarEvent[] {
      const { name } = task.general;
      return task.mobilizations.map(
        ({ start, end }): CalendarEvent => ({
          start,
          end,
          name,
          timed: true,
          color: ORANGE,
        }),
      );
    },
    convertAssignmentsToCalendarEvent(
      task: FestivalTaskReadyToAssign,
    ): CalendarEvent[] {
      const { name } = task.general;
      return task.mobilizations.flatMap(({ assignments }) =>
        assignments.map(
          ({ start, end }): CalendarEvent => ({
            start,
            end,
            timed: true,
            color: PURPLE,
            name,
          }),
        ),
      );
    },
    toggleDisplay(event: DisplayableEvent) {
      switch (event) {
        case "mobilizations-or-assignments":
          this.displayMobilizationsOrAssignments =
            !this.displayMobilizationsOrAssignments;
          break;
        case "activity-time-windows":
          this.displayActivityTimeWindows = !this.displayActivityTimeWindows;
          break;
        case "activity-inquiries":
          this.displayActivityInquiries = !this.displayActivityInquiries;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.filters {
  padding: 10px 0px;
  display: flex;
  flex-direction: row;
  gap: 10px;
  justify-content: center;
  background-color: white;
  #mobilizations-or-assignments,
  #activity-time-windows,
  #activity-inquiries {
    color: white;
  }
}

@media only screen and (max-width: $mobile-max-width) {
  .filters {
    flex-direction: column;
    align-items: center;
    .v-btn {
      width: 90%;
    }
  }
}
</style>
