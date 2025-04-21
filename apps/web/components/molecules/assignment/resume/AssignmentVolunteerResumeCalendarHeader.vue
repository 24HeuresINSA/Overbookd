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
    <p class="stat">{{ assignmentStat }}</p>
  </div>
</template>

<script lang="ts" setup>
import type { TaskWithAssignmentsSummary } from "@overbookd/assignment";
import { Duration } from "@overbookd/time";
import { buildUserName } from "@overbookd/user";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

const props = defineProps({
  volunteer: {
    type: Object as () => VolunteerForCalendar,
    required: true,
  },
});

const displayableVolunteerNameWithCharisma = computed(() => {
  const formatedName = buildUserName(props.volunteer);
  return `${formatedName} | ${props.volunteer.charisma}`;
});
const sortedVolunteerTeams = computed<string[]>(() => {
  const filteredTeams = props.volunteer.teams.filter(
    (team) => team !== "admin" && team !== "orga",
  );
  if (filteredTeams.includes("soft")) {
    return ["soft", ...filteredTeams.filter((team) => team !== "soft")];
  }
  if (filteredTeams.includes("hard")) {
    return ["hard", ...filteredTeams.filter((team) => team !== "hard")];
  }
  return filteredTeams;
});
const assignmentStat = computed<string>(() => {
  const duration = Duration.ms(props.volunteer.assignmentDuration ?? 0);
  return `${category.value.toLowerCase()} : ${duration.toString()}`;
});

const selectedTask = computed<TaskWithAssignmentsSummary | null>(
  () => assignTaskToVolunteerStore.selectedTask,
);
const category = computed<string>(() => {
  if (!selectedTask) return "affectées";
  return selectedTask.value?.category ?? "indéterminées";
});
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
