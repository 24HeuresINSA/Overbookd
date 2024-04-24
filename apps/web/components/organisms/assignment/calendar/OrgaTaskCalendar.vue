<template>
  <OverCalendar
    v-model="calendarMarker"
    :events="assignedTasks"
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
        @mouseup.middle="openFtInNewTab(event.taskId)"
        @contextmenu.prevent="selectAssignmentToDisplayDetails(event)"
      >
        {{ event.name }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DateString, Hour, Period } from "@overbookd/period";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import AssignmentUserStats from "~/components/molecules/user/AssignmentUserStats.vue";
import { CalendarEvent } from "~/utils/models/calendar.model";
import { VolunteerAssignmentStat } from "~/utils/models/user.model";
import { formatUsername } from "~/utils/user/user.utils";
import { isItAvailableDuringThisHour } from "~/utils/availabilities/availabilities";
import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import { CalendarEventWithIdentifier } from "~/utils/assignment/calendar-event";
import {
  AssignmentSummaryWithTask,
  DisplayableAssignment,
} from "@overbookd/http";
import { PURPLE } from "~/domain/common/status-color";

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
    assignedTasks(): CalendarEvent[] {
      const alreadyAssigned = [...this.alreadyAssignedAssignments].map(
        (assignment) => this.formatAssignmentForCalendar(assignment, PURPLE),
      );
      const hoverAssignments = this.hoverAssignment
        ? [this.formatAssignmentForCalendar(this.hoverAssignment)]
        : [];

      return [...alreadyAssigned, ...hoverAssignments];
    },
    hourToScrollTo(): number | undefined {
      return this.hoverAssignment?.start.getHours();
    },
    stats(): VolunteerAssignmentStat[] {
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
      ]);
    },
    isVolunteerAvailableDuringThisHour(date: DateString, hour: Hour) {
      return isItAvailableDuringThisHour(this.availabilities, date, hour);
    },
    selectAssignmentToDisplayDetails(assignment: DisplayableAssignment) {
      this.$accessor.assignVolunteerToTask.fetchAssignmentDetails(assignment);
      this.$emit("display-assignment-details");
    },
    openFtInNewTab(ftId: number) {
      window.open(`/ft/${ftId}`);
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
