<template>
  <div lcass="volunteer-resume">
    <span class="volunteer-name-charisma">
      {{ displayableVolunteerNameWithCharisma }}
    </span>
    <div class="teams">
      <TeamChip
        v-for="team of sortedVolunteerTeams"
        :key="team"
        :team="team"
        size="x-small"
      />
    </div>
    <AssignmentVolunteerIcons :volunteer />
    <p class="stat">
      {{ getStatCategoryName(assignmentCategory) }} :
      {{ getDisplayedDuration(volunteer.assignmentDuration) }}
    </p>
    <p class="stat">
      Total : {{ getDisplayedDuration(volunteer.totalAssignmentDuration) }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { AssignableVolunteer } from "@overbookd/assignment";
import type { Category } from "@overbookd/festival-event-constants";
import { Duration } from "@overbookd/time";
import { buildUserName } from "@overbookd/user";
import { getStatCategoryName } from "~/utils/assignment/task-category";
import { sortTeamsForAssignment } from "~/utils/sort/sort-teams.utils";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

const { volunteer } = defineProps({
  volunteer: {
    type: Object as PropType<AssignableVolunteer>,
    required: true,
  },
});

const displayableVolunteerNameWithCharisma = computed(() => {
  const formatedName = buildUserName(volunteer);
  return `${formatedName} | ${volunteer.charisma}`;
});
const sortedVolunteerTeams = computed<string[]>(() =>
  sortTeamsForAssignment(volunteer.teams),
);
const assignmentCategory = computed<Category | null>(
  () => assignTaskToVolunteerStore.selectedTask?.category ?? null,
);

const getDisplayedDuration = (duration: number): string => {
  return Duration.ms(duration).toString();
};
</script>

<style lang="scss" scoped>
.volunteer-resume {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}

.volunteer-name-charisma {
  font-size: 1rem;
  font-weight: 500;
  margin-top: 2px;
  margin-bottom: 2px;
  text-align: center;
  min-width: 100%;
}

.teams {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.stat {
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
}
</style>
