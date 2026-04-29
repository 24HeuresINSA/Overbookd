<template>
  <v-virtual-scroll
    :items="assignments"
    item-height="70"
    class="virtual-scroll"
    @mouseleave="hoverAssignment(null)"
  >
    <template #default="{ item }">
      <v-list-item
        :key="`${item.taskId}-${item.mobilizationId}-${item.assignmentId}`"
        class="list-item"
        @mouseover="hoverAssignment(item)"
      >
        <AssignmentResume
          :assignment="item"
          class="list-item__assignment"
          @selected-team="assign(item, $event)"
        />
      </v-list-item>
    </template>
  </v-virtual-scroll>
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

const emit = defineEmits(["volunteer-assigned"]);
const assign = async (
  { assignmentId, mobilizationId, taskId }: AssignmentSummaryWithTask,
  as: string,
) => {
  if (!selectedVolunteer.value) return;
  const assignment = { taskId, mobilizationId, assignmentId };
  const volunteer = { id: selectedVolunteer.value.id, as };
  await assignVolunteerToTaskStore.assign(assignment, volunteer);
  emit("volunteer-assigned", volunteer.id);
};
</script>

<style lang="scss" scoped>
.virtual-scroll {
  height: 100%;
  padding: 0 5px;
}

.list-item {
  padding: 0;
  &__volunteer {
    padding: 0 16px;
  }
}
</style>
