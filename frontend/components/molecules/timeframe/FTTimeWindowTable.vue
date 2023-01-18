<template>
  <v-data-table
    :headers="headers"
    :items="timeWindows"
    dense
    item-key="key"
    :items-per-page="-1"
    sort-by="dateStart"
  >
    <template #[`item.startDate`]="{ item }">
      {{ formatDate(item.start) }}
    </template>
    <template #[`item.endDate`]="{ item }">
      {{ formatDate(item.end) }}
    </template>
    <template #[`item.sliceTime`]="{ item }">
      {{ item.sliceTime ? floatToHour(item.sliceTime) : "" }}
    </template>
    <template #[`item.userRequests`]="{ index, item }">
      <v-chip-group column>
        <template v-for="(req, i) in item.userRequests">
          <v-chip
            v-if="req"
            :key="i"
            close
            @click:close="deleteUserRequest(index, i)"
          >
            {{ formatUsername(req) }}
          </v-chip>
        </template>
      </v-chip-group>
    </template>
    <template #[`item.teamRequests`]="{ index, item }">
      <v-chip-group column>
        <template v-for="(req, i) in item.teamRequests">
          <v-chip
            v-if="req"
            :key="i"
            close
            @click:close="deleteTeamRequest(index, i)"
          >
            {{ formatTeamRequestText(req.quantity, req.team.name) }}
          </v-chip>
        </template>
      </v-chip-group>
    </template>
    <template #[`item.action`]="{ item }">
      <div>
        <v-btn icon @click="editVolunteer(item)">
          <v-icon>mdi-account-multiple-plus</v-icon>
        </v-btn>
        <v-btn icon @click="editTimeWindow(item)">
          <v-icon>mdi-clock-edit</v-icon>
        </v-btn>
        <v-btn icon @click="deleteTimeWindow(item)">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { FTTimeWindow } from "~/utils/models/ft";
import { User } from "~/utils/models/user";

export default Vue.extend({
  name: "FTTimeWindowTable",
  data: () => ({
    headers: [
      { text: "Date de début", value: "startDate" },
      { text: "Date de fin", value: "endDate" },
      { text: "Découpage", value: "sliceTime" },
      { text: "Bénévoles Requis", value: "userRequests" },
      { text: "Equipes Requises", value: "teamRequests" },
      { text: "Action", value: "action" },
    ],
  }),
  computed: {
    timeWindows(): FTTimeWindow[] {
      return this.$accessor.FT.mFT.timeWindows;
    },
  },
  methods: {
    formatDate(date: string): string {
      return formatDateWithMinutes(date);
    },
    formatUsername({ firstname, lastname }: User) {
      return `${firstname} ${lastname}`;
    },
    formatTeamRequestText(quantity: number, teamName: string) {
      return `${quantity} ${teamName}`;
    },
    floatToHour(float: number): string {
      const hours = Math.floor(float);
      const minutes = Math.round((float - hours) * 60);
      return `${hours}h${minutes ? minutes : ""}`;
    },
    editTimeWindow(timeWindow: FTTimeWindow) {
      this.$emit("update-time", timeWindow);
    },
    editVolunteer(timeWindow: FTTimeWindow) {
      this.$emit("update-volunteer", timeWindow);
    },
    deleteTimeWindow(timeWindow: FTTimeWindow) {
      this.$emit("delete", timeWindow);
    },
    deleteUserRequest(timeWindowIndex: number, userRequestIndex: number) {
      const timeWindow = this.timeWindows[timeWindowIndex];
      let userRequests = timeWindow.userRequests.slice();
      userRequests.splice(userRequestIndex, 1);

      const mTimeWindow: FTTimeWindow = {
        ...timeWindow,
        userRequests,
      };
      this.updateTimeWindow(mTimeWindow);
    },
    deleteTeamRequest(timeWindowIndex: number, teamRequestIndex: number) {
      const timeWindow = this.timeWindows[timeWindowIndex];
      let teamRequests = timeWindow.teamRequests.slice();
      teamRequests.splice(teamRequestIndex, 1);

      const mTimeWindow: FTTimeWindow = {
        ...timeWindow,
        teamRequests,
      };
      this.updateTimeWindow(mTimeWindow);
    },
    updateTimeWindow(timeWindow: FTTimeWindow) {
      this.$accessor.FT.updateTimeWindow(timeWindow);
    },
  },
});
</script>
