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
        <v-chip class="location" color="primary">
          <v-icon left>mdi-map-marker</v-icon>
          <span>{{ location }}</span>
        </v-chip>
        <v-chip class="timetable" color="primary">
          <v-icon left>mdi-clock</v-icon>
          <span>{{ timetable }}</span>
        </v-chip>
        <TeamIconChip
          v-for="team in requestedTeams"
          :key="team"
          :team="team"
          size="medium"
          with-name
        />
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
            <TeamIconChip
              v-for="team in item.teams"
              :key="team"
              :team="team"
              class="ml-1"
            />
          </template>
          <template #item.assignedTeam="{ item }">
            <TeamIconChip :team="item.assignedTeam" size="medium" with-name />
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
              v-if="canEditAffectedTeam(item)"
              icon
              @click="editAffectedTeam(item.id)"
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
import TeamIconChip from "~/components/atoms/TeamIconChip.vue";
import { getUnderlyingTeams } from "~/domain/timespan-assignment/underlying-teams";
import { formatDateToHumanReadable } from "~/utils/date/dateUtils";
import {
  TimespanAssignee,
  TimespanWithAssignees,
} from "~/utils/models/ftTimespan";
import { User } from "~/utils/models/user";

export default Vue.extend({
  name: "TimespanDetails",
  components: { TeamIconChip },
  data: () => ({
    headers: [
      { text: "Bénévole", value: "volunteer", width: 300, sortable: false },
      { text: "Affecté en tant que", value: "assignedTeam", sortable: false },
      { text: "Amis affectés", value: "friends", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],
  }),
  computed: {
    timespan(): TimespanWithAssignees | null {
      return this.$accessor.assignment.timespanToDisplayDetails;
    },
    task(): string {
      if (!this.timespan) return "";
      return `[${this.timespan.ft.id}] ${this.timespan.ft.name}`;
    },
    location(): string {
      if (!this.timespan) return "";
      return this.timespan.ft.location;
    },
    timetable(): string {
      if (!this.timespan) return "";
      const start = formatDateToHumanReadable(this.timespan.start);
      const end = formatDateToHumanReadable(this.timespan.end);
      return `${start} - ${end}`;
    },
    requestedTeams(): string[] {
      if (!this.timespan) return [];
      return this.timespan.requestedTeams.map((team) => team.code);
    },
    requiredVolunteers(): User[] {
      if (!this.timespan) return [];
      return this.timespan.requiredVolunteers;
    },
    assignees(): TimespanAssignee[] {
      if (!this.timespan) return [];
      return this.timespan.assignees;
    },
  },
  methods: {
    unassignVolunteer(assignee: TimespanAssignee) {
      if (!this.timespan) return;
      this.$accessor.assignment.unassignVolunteer({
        timespanId: this.timespan.id,
        assigneeId: assignee.id,
      });
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    openFtInNewTab() {
      if (!this.timespan) return;
      const ftId = this.timespan.ft.id;
      window.open(`/ft/${ftId}`, "_blank");
    },
    openCalendarInNewTab(assigneeId: number) {
      window.open(`/calendar/${assigneeId}`, "_blank");
    },
    canEditAffectedTeam(assignee: TimespanAssignee): boolean {
      if (!this.timespan) return false;
      const assignableTeams = this.timespan.requestedTeams
        .filter((team) => team.quantity > team.assignmentCount)
        .map((team) => team.code);
      if (assignableTeams.length === 0) return false;

      const underlyingTeams = getUnderlyingTeams(assignee.teams);
      const volunteerTeams = [...underlyingTeams, ...assignee.teams];

      return volunteerTeams.some((team) => assignableTeams.includes(team));
    },
    editAffectedTeam(assigneeId: number) {
      // TODO
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
</style>
