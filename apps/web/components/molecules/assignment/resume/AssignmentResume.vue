<template>
  <div
    class="assignment-card"
    :class="{ 'only-one-team': hasOnlyOneTeamToSelect }"
    @click="teamSelectShortcut"
  >
    <div
      class="assignment-card-data"
      :class="{ clickable: hasOnlyOneTeamToSelect }"
    >
      <div class="assignment-details">
        <div class="assignment-name">
          <span>{{ assignment.taskId }} - {{ assignment.name }}</span>
        </div>
        <div class="assignment-remaining-team-requests">
          <span v-for="request in remaingTeamRequests" :key="request.team">
            {{ findTeamName(request.team) }}: {{ request.missing }}
          </span>
        </div>
      </div>
      <div class="assignment-teams">
        <span
          v-for="{ team } of assignment.teams"
          :key="team"
          class="team-chip-wrapper"
          :class="{
            clickable: doesSelectedVolunteerHaveGivenTeam(team),
          }"
        >
          <TeamChip
            :team="team"
            show-hidden
            :clickable="doesSelectedVolunteerHaveGivenTeam(team)"
            @click="selectTeam(team)"
          />
        </span>
      </div>
    </div>
    <div class="has-friends-assigned">
      <v-icon
        v-if="assignment.hasFriendsAssigned"
        v-tooltip:top="'Ami(s) déjà assigné(s) sur le créneau'"
        icon="mdi-account-check"
        aria-label="Ami(s) déjà assigné(s) sur le créneau"
        size="small"
        color="green"
      />
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts" setup>
import {
  type VolunteerWithAssignmentDuration,
  retrieveImplicitTeams,
} from "@overbookd/assignment";
import type { AssignmentSummaryWithTask } from "@overbookd/http";

const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const teamStore = useTeamStore();

const props = defineProps({
  assignment: {
    type: Object as PropType<AssignmentSummaryWithTask>,
    required: true,
  },
});

const selectedVolunteer = computed<VolunteerWithAssignmentDuration | null>(
  () => assignVolunteerToTaskStore.selectedVolunteer,
);

const doesSelectedVolunteerHaveGivenTeam = (teamCode: string) => {
  const teams = retrieveImplicitTeams(selectedVolunteer.value?.teams ?? []);
  return teams.includes(teamCode);
};

const remaingTeamRequests = computed<{ team: string; missing: number }[]>(
  () => {
    const assignments = assignVolunteerToTaskStore.assignments.find(
      ({ assignmentId, mobilizationId, taskId }) => {
        return (
          assignmentId === props.assignment.assignmentId &&
          mobilizationId === props.assignment.mobilizationId &&
          taskId === props.assignment.taskId
        );
      },
    );
    if (!assignments) return [];

    return assignments.teams
      .filter(({ assigned, demand }) => assigned < demand)
      .map(({ team, assigned, demand }) => ({
        team,
        missing: demand - assigned,
      }));
  },
);

const emit = defineEmits(["selected-team"]);
const selectTeam = (teamCode: string) => emit("selected-team", teamCode);

const hasOnlyOneTeamToSelect = computed(() => {
  return props.assignment.teams.length === 1;
});

const teamSelectShortcut = () => {
  if (!hasOnlyOneTeamToSelect.value) return;
  const team = props.assignment.teams.at(0)?.team;
  if (!team) return;
  selectTeam(team);
};

const findTeamName = (code: string): string => {
  return teamStore.getTeamByCode(code)?.name ?? code;
};
</script>

<style scoped>
.assignment-card {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.assignment-card-data {
  min-height: 70px;
  display: flex;
  cursor: default;
}

.assignment-details {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding-left: 8px;
  flex-direction: column;
}

.assignment-remaining-team-requests {
  color: grey;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.assignment-teams {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 8px;
  margin: 2px 0 2px 5px;
  flex-wrap: wrap;
  flex-basis: 100px;
  gap: 2px;
}

.team-chip-wrapper {
  opacity: 0.6;
}

.team-chip-wrapper.clickable:hover,
.assignment-card.only-one-team:hover .team-chip-wrapper {
  opacity: 1;
}

.has-friends-assigned {
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
