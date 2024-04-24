<template>
  <div class="assignment-card" @click="teamSelectShortcut()">
    <div
      class="assignment-card-data"
      @contextmenu.prevent="openFtInNewTab(assignment.taskId)"
    >
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
        ></TeamChip>
      </div>
    </div>
    <div class="has-friends-assigned">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-icon
            v-if="assignment.hasFriendsAssigned"
            small
            color="green"
            v-bind="attrs"
            v-on="on"
          >
            mdi-account-check
          </v-icon>
        </template>
        <span>Ami(s) déjà assigné(s) sur le créneau</span>
      </v-tooltip>
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { AssignmentSummaryWithTask } from "@overbookd/http";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";

export default defineComponent({
  name: "AssignmentResume",
  components: { TeamChip },
  props: {
    assignment: {
      type: Object as () => AssignmentSummaryWithTask,
      required: true,
    },
  },
  computed: {
    remaingTeamRequests(): { team: string; missing: number }[] {
      const assignments = this.$accessor.assignVolunteerToTask.assignments.find(
        ({ assignmentId, mobilizationId, taskId }) => {
          return (
            assignmentId === this.assignment.assignmentId &&
            mobilizationId === this.assignment.mobilizationId &&
            taskId === this.assignment.taskId
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
  },
  methods: {
    openFtInNewTab(ftId: number) {
      window.open(`/ft/${ftId}`, "_blank");
    },
    teamSelectShortcut() {
      if (this.assignment.teams.length !== 1) return;
      const team = this.assignment.teams.at(0)?.team;
      if (!team) return;
      this.selectTeam(team);
    },
    selectTeam(teamCode: string) {
      this.$emit("selected-team", teamCode);
    },
  },
});
</script>

<style lang="scss" scoped>
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
