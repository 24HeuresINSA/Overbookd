<template>
  <div class="assignment-list" @mouseleave="hoverAssignment(null)">
    <v-virtual-scroll
      :items="assignments"
      item-height="70"
      class="virtual-scroll"
    >
      <template #default="{ item }">
        <v-list-item :key="item.id" @mouseover="hoverAssignment(item)">
          <AssignmentResume
            :assignment="item"
            @selected-team="(team) => assign(item, team)"
          ></AssignmentResume>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import AssignmentResume from "../resume/AssignmentResume.vue";
import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import { AssignmentSummaryWithTask } from "@overbookd/http";

export default defineComponent({
  name: "TaskAssignmentList",
  components: { AssignmentResume },
  props: {
    assignments: {
      type: Array as () => AssignmentSummaryWithTask[],
      required: true,
      default: () => [],
    },
  },
  computed: {
    selectedVolunteer(): VolunteerWithAssignmentDuration | null {
      return this.$accessor.assignVolunteerToTask.selectedVolunteer;
    },
  },
  methods: {
    formatDate(date: Date) {
      return formatDateWithMinutes(date);
    },
    hoverAssignment(assignment: AssignmentSummaryWithTask | null) {
      this.$accessor.assignVolunteerToTask.setHoverAssignment(assignment);
    },
    assign(
      { assignmentId, mobilizationId, taskId }: AssignmentSummaryWithTask,
      as: string,
    ) {
      if (!this.selectedVolunteer) return;

      const assignment = { taskId, mobilizationId, assignmentId };
      const volunteer = { id: this.selectedVolunteer.id, as };

      this.$accessor.assignVolunteerToTask.assign({ assignment, volunteer });
    },
  },
});
</script>

<style lang="scss" scoped>
.assignment-list {
  width: 100%;
  height: 100%;
  overflow: auto;
  &__item {
    cursor: pointer;
  }
}
</style>
