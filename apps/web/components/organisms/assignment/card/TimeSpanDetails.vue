<template>
  <v-card class="timespan-details">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title>
      {{ task }}
      <v-icon right @click="openFtInNewTab">mdi-open-in-new</v-icon>
    </v-card-title>
    <v-card-text class="timespan-details__content">
      <div class="timespan-metadata">
        <v-chip color="primary">
          <v-icon left>mdi-map-marker</v-icon>
          <span>{{ location }}</span>
        </v-chip>
        <v-chip color="primary">
          <v-icon left>mdi-clock</v-icon>
          <span>{{ timetable }}</span>
        </v-chip>
        <TeamChip
          v-for="team in requestedTeams"
          :key="team"
          :team="team"
          size="medium"
          with-name
        ></TeamChip>
      </div>
      <div class="required-volunteers">
        <h2>Bénévoles requis sur le créneau</h2>
        <div class="volunteer-list">
          <v-chip v-for="volunteer in requiredVolunteers" :key="volunteer.id">
            <v-icon left>mdi-account</v-icon>
            <span>{{ volunteer.firstname }} {{ volunteer.lastname }}</span>
          </v-chip>
        </div>
        <p v-if="requiredVolunteers.length === 0">
          Aucun bénévole requis spécifiquement sur ce créneau
        </p>
      </div>
      <div class="assignees">
        <h2>Bénévoles affectés sur le créneau</h2>
        <v-data-table
          :headers="headers"
          :items="assignees"
          :items-per-page="-1"
          disable-pagination
          hide-default-footer
        >
          <template #item.volunteer="{ item }">
            {{ item.firstname }} {{ item.lastname }}
            <TeamChip
              v-for="team in item.teams"
              :key="team"
              :team="team"
              class="assignee-team"
            ></TeamChip>
          </template>
          <template #item.assignedTeam="{ item }">
            <div
              v-if="isUpdateAssignedTeamActiveForAssignee(item.id)"
              class="team-update"
            >
              <div class="team-update__teams">
                <TeamChip
                  v-for="team of getAssignableTeamsForVolunteer(item)"
                  :key="team"
                  :team="team"
                  size="medium"
                  with-name
                  :class="{ 'not-selected': isTeamNotSelected(team) }"
                  @click="selectTeamToAssign(team)"
                ></TeamChip>
              </div>
              <v-icon color="red" @click="cancelUpdateAssignedTeam()">
                mdi-close-circle
              </v-icon>
              <v-icon color="green" @click="updateAssignedTeam(item)">
                mdi-check-circle
              </v-icon>
            </div>
            <TeamChip
              v-else
              :team="item.assignedTeam"
              size="medium"
              with-name
            ></TeamChip>
          </template>
          <template #item.friends="{ item }">
            <div class="volunteer-list">
              <v-chip v-for="volunteer in item.friends" :key="volunteer.id">
                <v-icon left>mdi-account</v-icon>
                <span>{{ volunteer.firstname }} {{ volunteer.lastname }}</span>
              </v-chip>
            </div>
          </template>
          <template #item.actions="{ item }">
            <v-btn icon @click="openCalendarInNewTab(item.id)">
              <v-icon>mdi-calendar</v-icon>
            </v-btn>
            <v-btn
              v-if="canActivateAssignedTeamUpdate(item)"
              icon
              @click="toggleUpdateAssignedTeam(item)"
            >
              <v-icon>mdi-swap-vertical</v-icon>
            </v-btn>
            <v-btn icon @click="unassignVolunteer(item)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <template #no-data> Aucun bénévole affecté sur ce créneau </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { getUnderlyingTeams } from "~/domain/timespan-assignment/underlying-teams";
import { formatDateToHumanReadable } from "~/utils/date/dateUtils";
import { Header } from "~/utils/models/dataTable";
import { UpdateAssignedTeam } from "~/utils/models/assignment";
import {
  TimeSpanAssignee,
  TimeSpanWithAssignees,
} from "~/utils/models/ftTimeSpan";
import { User } from "~/utils/models/user";
import { isNumber, isString } from "~/utils/types/check";

export default Vue.extend({
  name: "TimeSpanDetails",
  components: { TeamChip },
  data: () => ({
    selectedAssigneeId: null as number | null,
    selectedTeamToAssign: null as string | null,
  }),
  computed: {
    timeSpan(): TimeSpanWithAssignees | null {
      return this.$accessor.assignment.timeSpanToDisplayDetails;
    },
    task(): string {
      if (!this.timeSpan) return "";
      return `[${this.timeSpan.ft.id}] ${this.timeSpan.ft.name}`;
    },
    location(): string {
      if (!this.timeSpan) return "";
      return this.timeSpan.ft.location;
    },
    timetable(): string {
      if (!this.timeSpan) return "";
      const start = formatDateToHumanReadable(this.timeSpan.start);
      const end = formatDateToHumanReadable(this.timeSpan.end);
      return `${start} - ${end}`;
    },
    requestedTeams(): string[] {
      if (!this.timeSpan) return [];
      return this.timeSpan.requestedTeams.map((team) => team.code);
    },
    requiredVolunteers(): User[] {
      if (!this.timeSpan) return [];
      return this.timeSpan.requiredVolunteers;
    },
    assignees(): TimeSpanAssignee[] {
      if (!this.timeSpan) return [];
      return this.timeSpan.assignees;
    },
    allTimeSpansTeamCodes(): string[] {
      if (!this.timeSpan) return [];
      return this.timeSpan.requestedTeams
        .filter((team) => team.quantity > team.assignmentCount)
        .map((team) => team.code);
    },
    isUpdateAssignedTeamActive(): boolean {
      return this.selectedAssigneeId !== null;
    },
    headers(): Header[] {
      const volunteer = {
        text: "Bénévole",
        value: "volunteer",
        width: "300px",
        sortable: false,
      };
      const assignedTeam = {
        text: "Affecté en tant que",
        value: "assignedTeam",
        sortable: false,
      };
      const friends = {
        text: "Amis affectés",
        value: "friends",
        sortable: false,
      };
      const actions = { text: "Actions", value: "actions", sortable: false };
      if (this.isUpdateAssignedTeamActive) {
        return [volunteer, assignedTeam, actions];
      }
      return [volunteer, assignedTeam, friends, actions];
    },
  },
  methods: {
    unassignVolunteer(assignee: TimeSpanAssignee) {
      if (!this.timeSpan) return;
      this.$accessor.assignment.unassignVolunteer({
        timeSpanId: this.timeSpan.id,
        assigneeId: assignee.id,
      });
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    openFtInNewTab() {
      if (!this.timeSpan) return;
      const ftId = this.timeSpan.ft.id;
      window.open(`/ft/${ftId}`, "_blank");
    },
    openCalendarInNewTab(assigneeId: number) {
      window.open(`/planning/${assigneeId}`, "_blank");
    },
    getAllVolunteerTeams(assignee: TimeSpanAssignee) {
      const underlyingTeams = getUnderlyingTeams(assignee.teams);
      return [...underlyingTeams, ...assignee.teams];
    },
    getAssignableTeamsForVolunteer(assignee: TimeSpanAssignee) {
      const volunteerTeams = this.getAllVolunteerTeams(assignee);
      const assignableTeams = this.allTimeSpansTeamCodes.filter(
        (team) =>
          volunteerTeams.includes(team) && team !== assignee.assignedTeam,
      );
      return [assignee.assignedTeam, ...assignableTeams];
    },
    canActivateAssignedTeamUpdate(assignee: TimeSpanAssignee): boolean {
      return this.getAssignableTeamsForVolunteer(assignee).length > 1;
    },
    toggleUpdateAssignedTeam(assignee: TimeSpanAssignee) {
      if (this.isUpdateAssignedTeamActive) {
        this.cancelUpdateAssignedTeam();
        return;
      }
      this.selectedAssigneeId = assignee.id;
      this.selectedTeamToAssign = assignee.assignedTeam;
    },
    isUpdateAssignedTeamActiveForAssignee(assigneeId: number): boolean {
      return this.selectedAssigneeId === assigneeId;
    },
    selectTeamToAssign(team: string) {
      this.selectedTeamToAssign = team;
    },
    isTeamNotSelected(team: string): boolean {
      return this.selectedTeamToAssign !== team;
    },
    cancelUpdateAssignedTeam() {
      this.selectedAssigneeId = null;
      this.selectedTeamToAssign = null;
    },
    canUpdateAssignedTeam(input: {
      timeSpanId?: number | null;
      assigneeId: number | null;
      team: string | null;
    }): input is UpdateAssignedTeam {
      return (
        isNumber(input.timeSpanId) &&
        isNumber(input.assigneeId) &&
        isString(input.team)
      );
    },
    updateAssignedTeam(assignee: TimeSpanAssignee) {
      const updateAssignedTeamForm = {
        timeSpanId: this.timeSpan?.id,
        assigneeId: this.selectedAssigneeId,
        team: this.selectedTeamToAssign,
      };
      if (!this.canUpdateAssignedTeam(updateAssignedTeamForm)) return;
      if (this.selectedTeamToAssign === assignee.assignedTeam) {
        this.cancelUpdateAssignedTeam();
        return;
      }
      this.$accessor.assignment.updateAssignedTeam(updateAssignedTeamForm);
      this.cancelUpdateAssignedTeam();
    },
  },
});
</script>

<style lang="scss" scoped>
.close-btn {
  position: absolute;
  top: 3px;
  right: 3px;
}

.timespan-metadata {
  display: flex;
  gap: 15px;
}

.timespan-details {
  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
    h2 {
      margin-bottom: 5px;
    }
    .volunteer-list {
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
      margin: 4px 0;
    }
  }
}

.assignee-team {
  margin-left: 4px;
}

.team-update {
  display: flex;
  gap: 3px;
  &__teams {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
}

.not-selected {
  opacity: 0.4;
}
</style>
