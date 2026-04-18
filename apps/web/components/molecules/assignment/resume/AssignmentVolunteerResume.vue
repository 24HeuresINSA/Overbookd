<template>
  <div class="volunteer-card">
    <div class="volunteer-card-data" @contextmenu.prevent="openPlanning">
      <div class="info-row">
        <span class="info-row__title">{{ formattedUserInformations }}</span>
        <AssignmentVolunteerIcons :volunteer class="info-row__icons" />
      </div>
      <div>
        <TeamChip
          v-for="team of sortedVolunteerTeams"
          :key="team"
          :team="team"
        />
      </div>
      <p class="stats-text">{{ assignmentStats }}</p>
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts" setup>
import type { TaskWithAssignmentsSummary } from "@overbookd/assignment";
import { Duration } from "@overbookd/time";
import { buildUserName } from "@overbookd/user";
import { PLANNING_URL } from "@overbookd/web-page";
import {
  type AssignmentVolunteer,
  isAssignableVolunteer,
} from "~/utils/assignment/assignment-volunteer";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import { getStatCategoryName } from "~/utils/assignment/task-category";
import { sortTeamsForAssignment } from "~/utils/sort/sort-teams.utils";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();
const route = useRoute();

const { volunteer } = defineProps({
  volunteer: {
    type: Object as PropType<AssignmentVolunteer>,
    required: true,
  },
});

const sortedVolunteerTeams = computed<string[]>(() =>
  sortTeamsForAssignment(volunteer.teams),
);
const formattedUserInformations = computed<string>(
  () => `${buildUserName(volunteer)} | ${volunteer.charisma}`,
);
const selectedTask = computed<TaskWithAssignmentsSummary | null>(
  () => assignTaskToVolunteerStore.selectedTask,
);

const isOrgaTask = computed<boolean>(() => isOrgaTaskMode(route.path));
const category = computed<string>(() => {
  if (isOrgaTask.value) return "Affecté";
  return getStatCategoryName(selectedTask.value?.category ?? null);
});

const getDisplayedDuration = (duration: number): string => {
  return Duration.ms(duration).toString();
};
const assignmentStats = computed<string>(() => {
  const duration = getDisplayedDuration(volunteer.assignmentDuration);
  const displayedTotalDuration = isAssignableVolunteer(volunteer)
    ? ` • Total : ${getDisplayedDuration(volunteer.totalAssignmentDuration)}`
    : "";
  return `${category.value} : ${duration}${displayedTotalDuration}`;
});

const openPlanning = (): void => {
  window.open(`${PLANNING_URL}/${volunteer.id}`);
};
</script>

<style lang="scss" scoped>
.volunteer-card {
  width: 100%;
  min-height: 80px;
  display: flex;
  flex-direction: column;
}

.volunteer-card-data {
  overflow: hidden;
}

.info-row {
  display: flex;
  justify-content: space-between;

  &__title {
    font-size: 1rem;
    font-weight: 500;
    margin-top: 2px;
    margin-bottom: 2px;
  }

  &__icons {
    margin-top: 5px;
  }
}

.stats-text {
  text-transform: capitalize;
  font-size: 0.9rem;
  margin-top: 2px;
  margin-bottom: 4px;
}
</style>
