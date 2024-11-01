<template>
  <div class="assignment-card" @click="teamSelectShortcut">
    <div class="assignment-card-data">
      <div class="assignment-details">
        <div class="assignment-name">
          <span>{{ assignment.taskId }} - {{ assignment.name }}</span>
        </div>
        <div class="assignment-remaining-team-requests">
          <span v-for="request in remaingTeamRequests" :key="request.team">
            {{ request.team }}: {{ request.missing }}
          </span>
        </div>
      </div>
      <div class="assignment-teams">
        <TeamChip
          v-for="{ team } of assignment.teams"
          :key="team"
          :team="team"
          with-name
          show-hidden
          @click="selectTeam(team)"
        />
      </div>
    </div>
    <div class="has-friends-assigned">
      <v-icon
        v-if="assignment.hasFriendsAssigned"
        v-tooltip:top="'Ami(s) déjà assigné(s) sur le créneau'"
        icon="mdi-account-check"
        size="small"
        color="green"
      />
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts" setup>
import type { AssignmentSummaryWithTask } from "@overbookd/http";

const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();

const props = defineProps({
  assignment: {
    type: Object as PropType<AssignmentSummaryWithTask>,
    required: true,
  },
});

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

const teamSelectShortcut = () => {
  if (props.assignment.teams.length !== 1) return;
  const team = props.assignment.teams.at(0)?.team;
  if (!team) return;
  selectTeam(team);
};
</script>

<style scoped>
.assignment-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.assignment-card-data {
  height: 70px;
  overflow: hidden;
  display: flex;
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

.has-friends-assigned {
  position: absolute;
  top: 0px;
  left: 0px;
}
</style>
