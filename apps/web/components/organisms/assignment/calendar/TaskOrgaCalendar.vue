<template>
  <OverCalendar
    v-model="calendarMarker"
    :title="taskName"
    :events="assignments"
    :hour-to-scroll-to="hourToScrollTo"
  >
    <template #event="{ event: assignment }">
      <div
        class="event underline-on-hover"
        :class="{ highlight: isSelectedAssignment(assignment.identifier) }"
        @click="selectAssignment(assignment)"
        @mouseup.middle="openSelectedTaskInNewTab"
        @contextmenu.prevent="
          selectAssignmentToDisplayDetails(assignment.identifier)
        "
      >
        {{ assignment.name }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  AssignmentIdentifier,
  AssignmentSummary,
  AssignmentTeam,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import { CalendarEvent } from "~/utils/models/calendar.model";
import { FtTimeSpanEvent } from "~/utils/models/ft-time-span.model";

export default defineComponent({
  name: "TaskOrgaCalendar",
  components: { OverCalendar },
  emits: ["display-assignment-details"],
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    selectedTask(): TaskWithAssignmentsSummary | null {
      return this.$accessor.assignTaskToVolunteer.selectedTask;
    },
    taskName(): string {
      if (this.selectedTask === null) return "";
      return `[${this.selectedTask.id}] ${this.selectedTask.name}`;
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    assignments(): CalendarEvent[] {
      return (this.selectedTask?.assignments ?? []).flatMap((assignment) =>
        this.mapAssignmentToEvent(assignment),
      );
    },
    selectedAssignment(): AssignmentSummary | null {
      return null;
    },
    hourToScrollTo(): number | undefined {
      return this.assignments.at(0)?.start.getHours();
    },
  },
  watch: {
    selectedTask(task: TaskWithAssignmentsSummary | null): void {
      if (!task) return;
      this.calendarMarker = task.assignments.at(0)?.start ?? this.manifDate;
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.calendarMarker = this.manifDate;
  },
  methods: {
    isSelectedAssignment({
      mobilizationId,
      assignmentId,
    }: AssignmentIdentifier): boolean {
      if (!this.selectedAssignment) return false;
      return (
        this.selectedAssignment.identifier.mobilizationId === mobilizationId &&
        this.selectedAssignment.identifier.assignmentId === assignmentId
      );
    },
    selectAssignment(timeSpan: FtTimeSpanEvent) {
      this.$accessor.assignment.setSelectedTimeSpan(timeSpan);
    },
    selectAssignmentToDisplayDetails(identifier: AssignmentIdentifier) {
      this.$emit("display-assignment-details", identifier);
    },
    mapAssignmentToEvent(assignment: AssignmentSummary): CalendarEvent[] {
      return assignment.teams.map((team) => ({
        ...assignment,
        name: this.buildEventName(team),
        timed: true,
        color: this.defineEventColor(team),
      }));
    },
    buildEventName({ assigned, demands, code }: AssignmentTeam): string {
      return `[${assigned}/${demands}] ${code}`;
    },
    getTeamColor(code: string): string {
      return this.$accessor.team.getTeamByCode(code)?.color ?? "blue";
    },
    defineEventColor({ assigned, demands, code }: AssignmentTeam): string {
      const color = this.getTeamColor(code);
      const spread = (180 * assigned) / demands + 75;
      return color + this.convertDecimalToHex(spread);
    },
    convertDecimalToHex(decimal: number): string {
      const hex = decimal.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    },
    openSelectedTaskInNewTab() {
      if (this.selectedTask === null) return;
      window.open(`/ft/${this.selectedTask.id}`);
    },
  },
});
</script>

<style lang="scss" scoped>
.event {
  height: 100%;
  white-space: normal;
  padding: 2px;
  overflow: hidden;
}

.highlight {
  border: solid;
}
</style>
