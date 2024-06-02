<template>
  <div class="calendar-list">
    <OverMultiCalendar
      v-model="date"
      :users="volunteers"
      :event-to-add="periodAsEvent"
      :planning-events="tasksAsEvents"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { IProvidePeriod } from "@overbookd/period";
import { CalendarPlanningEvent } from "~/domain/common/planning-events";
import OverMultiCalendar from "../calendar/OverMultiCalendar.vue";
import { CalendarUser } from "~/utils/calendar/user";
import { HelpingVolunteerAssignment } from "@overbookd/http";
import { PURPLE } from "~/domain/common/status-color";

export default defineComponent({
  name: "CalendarList",
  components: { OverMultiCalendar },
  data: () => {
    return {
      date: new Date(),
    };
  },
  computed: {
    period(): IProvidePeriod {
      return this.$accessor.needHelp.period;
    },
    volunteers(): CalendarUser[] {
      return this.$accessor.needHelp.filteredVolunteers;
    },
    periodAsEvent(): CalendarPlanningEvent {
      const period = this.$accessor.needHelp.period;
      return {
        ...period,
        name: "Viens m'aider",
      };
    },
    tasksAsEvents(): CalendarPlanningEvent[] {
      return this.$accessor.needHelp.volunteers.flatMap(({ assignments, id }) =>
        assignments.map((assignment) =>
          this.convertAssignmentToPlanningEvent(assignment, id),
        ),
      );
    },
  },
  watch: {
    period() {
      this.date = this.$accessor.needHelp.start;
    },
  },
  created() {
    this.date = this.$accessor.needHelp.start;
  },
  methods: {
    convertAssignmentToPlanningEvent(
      { id, name, start, end }: HelpingVolunteerAssignment,
      volunteerId: number,
    ): CalendarPlanningEvent {
      return {
        start,
        end,
        name: `[${id}] ${name}`,
        color: PURPLE,
        volunteerId,
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.calendar-list {
  overflow-y: scroll;
}
</style>
