<template>
  <v-card
    class="filterable-assignment-list"
    :class="{ closed: isSideBarClosed }"
  >
    <v-btn
      icon="mdi-chevron-right"
      :aria-label="`${isSideBarClosed ? 'Ouvrir' : 'Fermer'} la liste de créneaux`"
      :title="`${isSideBarClosed ? 'Ouvrir' : 'Fermer'} la liste de créneaux`"
      variant="flat"
      density="compact"
      class="btn-close-side-bar"
      :class="{ 'rotate-180': isSideBarClosed }"
      @click="toggleSideBar"
    />

    <v-card-text
      v-if="!isSideBarClosed"
      class="filterable-assignment-list__text"
    >
      <TaskFilters
        v-model="filters"
        :list-length="filteredAssignments.length"
        class="filters"
      />
      <v-divider />
      <TaskAssignmentList
        v-if="shouldShowAssignmentList"
        :assignments="filteredAssignments"
        @volunteer-assigned="propageteVolunteerAssigned"
      />
      <div v-else class="error-message">
        <p v-if="!selectedVolunteer">Aucun bénévole séléctionné</p>
        <p v-else>
          Aucun créneau disponible pour {{ selectedVolunteer.firstName }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { VolunteerWithAssignmentDuration } from "@overbookd/assignment";
import type { AssignmentSummaryWithTask } from "@overbookd/http";
import { SlugifyService } from "@overbookd/slugify";
import { TaskAssignmentFilterBuilder } from "~/utils/assignment/filters/task-assignment.filter";
import {
  matchTaskAssignmentFilters,
  type FilterableTask,
} from "~/utils/assignment/filters/task-assignment.matcher";
import { useRouteQueryFilters } from "~/utils/http/url-params.utils";

const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();

const filters = useRouteQueryFilters((query) =>
  TaskAssignmentFilterBuilder.getFromRouteQuery(query),
);

const isSideBarClosed = ref<boolean>(false);
const toggleSideBar = () => {
  isSideBarClosed.value = !isSideBarClosed.value;
};

const emit = defineEmits(["volunteer-assigned"]);
const propageteVolunteerAssigned = (volunteerId: number) => {
  emit("volunteer-assigned", volunteerId);
};

const toFilterableTask = ({
  task,
  teams,
  end,
  taskId,
}: AssignmentSummaryWithTask): FilterableTask => ({
  ...task,
  teams: teams.map(({ team }) => team),
  end,
  searchable: SlugifyService.apply(`${taskId} ${task.name}`),
});

const filteredAssignments = computed<AssignmentSummaryWithTask[]>(() => {
  const isMatching = matchTaskAssignmentFilters(filters.value);
  return assignVolunteerToTaskStore.assignments.filter((assignment) =>
    isMatching(toFilterableTask(assignment)),
  );
});

const selectedVolunteer = computed<VolunteerWithAssignmentDuration | null>(
  () => assignVolunteerToTaskStore.selectedVolunteer,
);
const shouldShowAssignmentList = computed<boolean>(
  () =>
    selectedVolunteer.value !== null && filteredAssignments.value.length > 0,
);
</script>

<style lang="scss" scoped>
.filterable-assignment-list {
  min-height: 100%;

  width: 420px;
  transition: width 0.3s ease;

  &.closed {
    width: 30px;
  }

  &__text {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0;
  }
}

.btn-close-side-bar {
  position: absolute;
  top: 16px;
  left: -3px;

  &.rotate-180 {
    left: 0;
  }
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.filters {
  flex-shrink: 0;
}

.error-message {
  align-items: center;
  justify-content: center;
  display: flex;
  height: 100%;
  margin: 0 5%;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}
</style>
