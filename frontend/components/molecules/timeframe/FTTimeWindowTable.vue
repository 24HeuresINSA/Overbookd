<template>
  <v-data-table
    :headers="headers"
    :items="timeWindows"
    dense
    item-key="key"
    :items-per-page="-1"
    sort-by="dateStart"
  >
    <template #item.startDate="{ item }">
      {{ formatDate(item.start) }}
    </template>
    <template #item.endDate="{ item }">
      {{ formatDate(item.end) }}
    </template>
    <template #item.sliceTime="{ item }">
      {{ item.sliceTime ? floatToHour(item.sliceTime) : "" }}
    </template>
    <template #item.userRequests="{ item }">
      <v-chip-group id="user-requests" column>
        <VolunteerRequestChip
          v-for="userRequest in item.userRequests"
          :key="userRequest.user.id"
          :disabled="disabled"
          :user-request="userRequest"
          @delete-user-request="deleteUserRequest(item, userRequest)"
        />
      </v-chip-group>
    </template>
    <template #item.teamRequests="{ item }">
      <v-chip-group column>
        <template v-for="(req, i) in item.teamRequests">
          <v-chip
            v-if="req"
            :key="i"
            :close="!disabled"
            @click:close="deleteTeamRequest(item, req)"
          >
            {{ formatTeamRequestText(req.quantity, req.team.name) }}
          </v-chip>
        </template>
      </v-chip-group>
    </template>
    <template #item.action="{ item }">
      <div v-if="!disabled">
        <v-btn
          v-if="shouldDisplayVolunteerEdition"
          icon
          @click="editVolunteer(item)"
        >
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
import VolunteerRequestChip from "~/components/atoms/assignment/VolunteerRequestChip.vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { isTaskValidatedBy } from "~/utils/festivalEvent/ftUtils";
import {
  FT,
  FTTeamRequest,
  FTTimeWindow,
  FTUserRequest,
  FTUserRequestImpl,
} from "~/utils/models/ft";

export default Vue.extend({
  name: "FTTimeWindowTable",
  components: { VolunteerRequestChip },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
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
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    timeWindows(): FTTimeWindow[] {
      return this.mFT.timeWindows.map((timeWindow) => ({
        ...timeWindow,
        userRequests: timeWindow.userRequests.map(FTUserRequestImpl.build),
      }));
    },
    shouldDisplayVolunteerEdition(): boolean {
      return !isTaskValidatedBy(this.mFT.reviews, "humain");
    },
  },
  methods: {
    formatDate(date: string): string {
      return formatDateWithMinutes(date);
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
    deleteUserRequest(timeWindow: FTTimeWindow, userRequest: FTUserRequest) {
      this.$accessor.FT.deleteUserRequest({ timeWindow, userRequest });
    },
    deleteTeamRequest(timeWindow: FTTimeWindow, teamRequest: FTTeamRequest) {
      this.$accessor.FT.deleteTeamRequest({ timeWindow, teamRequest });
    },
    updateTimeWindow(timeWindow: FTTimeWindow) {
      this.$accessor.FT.updateTimeWindow(timeWindow);
    },
  },
});
</script>
