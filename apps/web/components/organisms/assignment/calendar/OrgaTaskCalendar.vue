<template>
  <OverCalendar
    v-model="calendarMarker"
    :events="events"
    :hour-to-scroll-to="hourToScrollTo"
  >
    <template #title>
      <div v-show="selectedVolunteer" class="title">
        <h1 class="title__name">{{ volunteerName }}</h1>
        <span>|</span>
        <AssignmentUserStats :stats="stats" class="title__stats" />
      </div>
    </template>
    <template #interval="{ date, hour }">
      <div
        :class="{ available: isVolunteerAvailableDuringThisHour(date, hour) }"
      />
    </template>
    <template #event="{ event }">
      <div
        class="event underline-on-hover"
        @mouseup="openFtInNewTab(event)"
        @contextmenu.prevent="selectAssignmentToDisplayDetails(event)"
      >
        {{ event.name }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  DateString,
  Hour,
  IProvidePeriod,
  OverDate,
  Period,
} from "@overbookd/period";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import AssignmentUserStats from "~/components/molecules/user/AssignmentUserStats.vue";
import { CalendarEvent } from "~/utils/calendar/event";
import { formatUsername } from "~/utils/user/user.utils";
import { isItAvailableDuringThisHour } from "~/utils/availabilities/availabilities";
import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import { CalendarEventWithIdentifier } from "~/utils/assignment/calendar-event";
import {
  AssignmentStat,
  AssignmentSummaryWithTask,
  DisplayableAssignment,
  PlanningTask,
} from "@overbookd/http";
import { PURPLE, getColorByStatus } from "~/domain/common/status-color";
import { convertToCalendarBreak } from "~/domain/common/planning-events";

export default defineComponent({
  name: "OrgaTaskCalendar",
  components: { OverCalendar, AssignmentUserStats },
  emits: ["display-assignment-details"],
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    selectedVolunteer(): VolunteerWithAssignmentDuration | null {
      return this.$accessor.assignVolunteerToTask.selectedVolunteer;
    },
    volunteerName(): string {
      if (!this.selectedVolunteer) return "";
      return formatUsername(this.selectedVolunteer);
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    availabilities(): Period[] {
      return this.$accessor.volunteerAvailability.availabilities.list;
    },
    hoverAssignment(): AssignmentSummaryWithTask | null {
      return this.$accessor.assignVolunteerToTask.hoverAssignment;
    },
    alreadyAssignedAssignments(): DisplayableAssignment[] {
      return this.$accessor.assignVolunteerToTask.alreadyAssignedAssignments;
    },
    notReadyTasks(): PlanningTask[] {
      return this.$accessor.user.selectedUserTasks;
    },
    breaks(): IProvidePeriod[] {
      return this.$accessor.assignVolunteerToTask.breakPeriods;
    },
    events(): CalendarEvent[] {
      const tasks = this.notReadyTasks.map((task) =>
        this.formatTaskForCalendar(task),
      );
      const alreadyAssigned = [...this.alreadyAssignedAssignments].map(
        (assignment) => this.formatAssignmentForCalendar(assignment, PURPLE),
      );
      const hoverAssignments = this.hoverAssignment
        ? [this.formatAssignmentForCalendar(this.hoverAssignment)]
        : [];

      const breaks = this.breaks.map(convertToCalendarBreak);

      return [...tasks, ...alreadyAssigned, ...hoverAssignments, ...breaks];
    },
    hourToScrollTo(): number | undefined {
      return this.hoverAssignment?.start.getHours();
    },
    stats(): AssignmentStat[] {
      return this.$accessor.user.selectedUserAssignmentStats;
    },
  },
  watch: {
    hoverAssignment() {
      this.calendarMarker = this.hoverAssignment?.start || this.manifDate;
    },
    async selectedVolunteer(volunteer: VolunteerWithAssignmentDuration | null) {
      if (volunteer) await this.refreshVolunteerData(volunteer.id);
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.calendarMarker = this.manifDate;
  },
  methods: {
    async refreshVolunteerData(volunteerId: number) {
      await Promise.all([
        this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
          volunteerId,
        ),
        this.$accessor.user.getVolunteerAssignments(volunteerId),
        this.$accessor.user.getVolunteerAssignmentStats(volunteerId),
        this.$accessor.assignVolunteerToTask.fetchAllAssignmentsFor(
          volunteerId,
        ),
        this.$accessor.assignVolunteerToTask.fetchBreakPeriodsFor(volunteerId),
        this.$accessor.user.getVolunteerTasks(volunteerId),
      ]);
    },
    isVolunteerAvailableDuringThisHour(date: DateString, hour: Hour) {
      const overDate = OverDate.init({ date, hour });
      return isItAvailableDuringThisHour(this.availabilities, overDate);
    },
    selectAssignmentToDisplayDetails(
      event: DisplayableAssignment | CalendarEvent,
    ) {
      if ("taskId" in event) {
        this.$accessor.assignVolunteerToTask.fetchAssignmentDetails(event);
        this.$emit("display-assignment-details");
      }
    },
    openFtInNewTab(event: DisplayableAssignment | CalendarEvent) {
      if ("taskId" in event) return;
      window.open(event.link);
    },
    formatAssignmentForCalendar(
      assignment: DisplayableAssignment,
      color?: string,
    ): CalendarEventWithIdentifier {
      return {
        ...assignment,
        timed: true,
        color,
        name: `[${assignment.taskId}] ${assignment.name}`,
        identifier: {
          assignmentId: assignment.assignmentId,
          mobilizationId: assignment.mobilizationId,
          taskId: assignment.taskId,
        },
      };
    },
    formatTaskForCalendar({
      name,
      id,
      status,
      timeWindow: { start, end },
    }: PlanningTask): CalendarEvent {
      return {
        start,
        end,
        name: `[${id}] ${name}`,
        link: `/ft/${id}`,
        color: getColorByStatus(status),
        timed: true,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  &__name {
    font-size: 1.4rem;
    font-weight: 500;
    margin-right: 8px;
  }
  &__stats {
    margin-top: 2px;
    margin-left: 8px;
  }
}

.available {
  background-color: $calendar-available-background-color;
  height: 100%;
  width: 100%;
}

.event {
  height: 100%;
  white-space: normal;
  padding: 2px;
  overflow: hidden;
}

.underline-on-hover:hover {
  text-decoration: underline;
}
</style>
