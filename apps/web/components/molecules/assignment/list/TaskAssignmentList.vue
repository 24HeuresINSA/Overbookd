<template>
  <div class="assignment-list" @mouseleave="hoverAssignment(null)">
    <v-virtual-scroll
      :items="assignments"
      item-height="70"
      class="virtual-scroll"
    >
      <template #default="{ item }">
        <v-list-item
          :key="`${item.taskId}-${item.mobilizationId}-${item.assignmentId}`"
          @mouseover="hoverAssignment(item)"
        >
          <AssignmentResume
            :assignment="item"
            @selected-team="assign(item, $event)"
          />
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts" setup>
import type { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import type { AssignmentSummaryWithTask } from "@overbookd/http";

const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();

defineProps({
  assignments: {
    type: Array as PropType<AssignmentSummaryWithTask[]>,
    required: true,
  },
});

const selectedVolunteer = computed<VolunteerWithAssignmentDuration | null>(
  () => assignVolunteerToTaskStore.selectedVolunteer,
);
const hoverAssignment = (assignment: AssignmentSummaryWithTask | null) => {
  assignVolunteerToTaskStore.setHoverAssignment(assignment);
};
const assign = (
  { assignmentId, mobilizationId, taskId }: AssignmentSummaryWithTask,
  as: string,
) => {
  if (!selectedVolunteer.value) return;
  const assignment = { taskId, mobilizationId, assignmentId };
  const volunteer = { id: selectedVolunteer.value.id, as };
  assignVolunteerToTaskStore.assign(assignment, volunteer);
};
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
