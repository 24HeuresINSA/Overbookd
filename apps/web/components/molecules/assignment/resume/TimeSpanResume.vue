<template>
  <div class="timespan-card" @click="teamSelectShortcut()">
    <div
      class="timespan-card-data"
      @contextmenu.prevent="openFtInNewTab(timeSpan.ft.id)"
    >
      <div class="timespan-details">
        <div class="timespan-name">
          <span>{{ timeSpan.ft.id }} - {{ timeSpan.ft.name }}</span>
        </div>
        <div class="timespan-remaining-team-requests">
          <span v-for="request in remaingTeamRequests" :key="request.code">
            {{ request.code }}: {{ request.quantity }}
          </span>
        </div>
      </div>
      <div class="timespan-teams">
        <TeamChip
          v-for="requestedTeam of timeSpan.requestedTeams"
          :key="requestedTeam.code"
          :team="requestedTeam.code"
          with-name
          @click="selectTeam(requestedTeam.code)"
        ></TeamChip>
      </div>
    </div>
    <div class="has-friends-assigned">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-icon
            v-if="timeSpan.hasFriendsAssigned"
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
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { AvailableTimeSpan } from "~/utils/models/ft-time-span.model";

export default Vue.extend({
  name: "TimeSpanResume",
  components: { TeamChip },
  props: {
    timeSpan: {
      type: Object as () => AvailableTimeSpan,
      required: true,
    },
  },
  computed: {
    remaingTeamRequests(): { code: string; quantity: number }[] {
      const timeSpan = this.$accessor.assignment.timeSpans.find(
        ({ id }) => id === this.timeSpan.id,
      );
      if (!timeSpan) return [];

      return timeSpan.requestedTeams
        .filter(({ assignmentCount, quantity }) => assignmentCount < quantity)
        .map(({ code, assignmentCount, quantity }) => ({
          code,
          quantity: quantity - assignmentCount,
        }));
    },
  },
  methods: {
    openFtInNewTab(ftId: number) {
      window.open(`/ft/${ftId}`, "_blank");
    },
    teamSelectShortcut() {
      if (this.timeSpan.requestedTeams.length !== 1) return;
      const team = this.timeSpan.requestedTeams.at(0)?.code;
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
.timespan-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.timespan-card-data {
  height: 70px;
  overflow: hidden;
  display: flex;
}

.timespan-details {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding-left: 8px;
  flex-direction: column;
}

.timespan-remaining-team-requests {
  color: grey;
}

.timespan-teams {
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
