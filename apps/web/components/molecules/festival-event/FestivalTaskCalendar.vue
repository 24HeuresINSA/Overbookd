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
    <OverCalendar v-model="calendarMarker" :events="allEvents">
      <template #event="{ event }">
        <div
          class="event"
          @contextmenu.prevent="selectAssignmentToDisplayDetails(event)"
        >
          <strong>{{ event.name }}</strong> <br />
          <span v-if="event.end">
            {{ event.start.getHours() }}h - {{ event.end.getHours() }}h
          </span>
        </div>
      </template>
    </OverCalendar>
    <v-dialog v-model="displayAssignmentDetailsDialog" width="1000px">
      <AssignmentDetails
        v-if="assignmentDetails"
        :assignment-details="assignmentDetails"
        @close-dialog="closeAssignmentDetailsDialog"
        @unassign="unassignVolunteer"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Assignment } from "@overbookd/assignment";
import {
  FestivalTask,
  FestivalTaskReadyToAssign,
  Mobilization,
  isReadyToAssign,
} from "@overbookd/festival-event";
import { defineComponent } from "vue";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import AssignmentDetails from "~/components/organisms/assignment/card/AssignmentDetails.vue";
import { ORANGE, PURPLE } from "~/domain/common/status-color";
import { UnassignForm } from "~/utils/assignment/assignment";
import {
  CalendarEventWithIdentifier,
  isWithIdentifier,
} from "~/utils/assignment/calendar-event";
import { CalendarEvent } from "~/utils/models/calendar.model";

type FestivalTaskCalendarData = {
  displayMobilizationsOrAssignments: boolean;
  displayActivityTimeWindows: boolean;
  displayActivityInquiries: boolean;
  calendarMarker: Date;
  displayAssignmentDetailsDialog: boolean;
};

type DisplayableEvent =
  | "mobilizations-or-assignments"
  | "activity-time-windows"
  | "activity-inquiries";

export default defineComponent({
  name: "FestivalTaskCalendar",
  components: { OverCalendar, AssignmentDetails },
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
    displayAssignmentDetailsDialog: false,
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
    assignmentDetails(): Assignment<{ withDetails: true }> | null {
      return this.$accessor.festivalTask.assignmentDetails;
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
    ): CalendarEventWithIdentifier[] {
      const taskId = task.id;
      const { name } = task.general;
      type WithAssignment = Mobilization<{
        withAssignments: true;
        withConflicts: false;
      }>;

      return task.mobilizations.flatMap(
        ({ assignments, id: mobilizationId }: WithAssignment) => {
          return assignments.map(
            ({ start, end, id: assignmentId }): CalendarEventWithIdentifier => {
              const identifier = { taskId, mobilizationId, assignmentId };
              return {
                start,
                end,
                timed: true,
                color: PURPLE,
                name,
                identifier,
              };
            },
          );
        },
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
    async selectAssignmentToDisplayDetails(
      event: CalendarEvent | CalendarEventWithIdentifier,
    ) {
      if (!isWithIdentifier(event)) return;
      await this.$accessor.festivalTask.fetchAssignmentDetails(
        event.identifier,
      );
      this.displayAssignmentDetailsDialog = true;
    },
    closeAssignmentDetailsDialog() {
      this.displayAssignmentDetailsDialog = false;
    },
    unassignVolunteer(form: UnassignForm) {
      this.$accessor.festivalTask.unassign(form);
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

.event {
  height: 100%;
  white-space: normal;
  padding: 2px;
  overflow: hidden;
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
