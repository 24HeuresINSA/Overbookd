<template>
  <div class="timespan-card" @click="teamSelectShortcut()">
    <div
      class="timespan-card-data"
      @contextmenu.prevent="openFtNewTab(timespan.id)"
    >
      <div class="timespan-name">
        <span>{{ timespan.ft.id }} - {{ timespan.ft.name }}</span>
      </div>
      <div class="timespan-teams">
        <TeamIconChip
          v-for="requestedTeam of timespan.requestedTeams"
          :key="requestedTeam.code"
          :team="requestedTeam.code"
          with-name
          @click="selectTeam(requestedTeam.code)"
        />
      </div>
    </div>
    <div class="has-friends-assigned">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <v-icon
            v-if="timespan.hasFriendsAssigned"
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
import TeamIconChip from "~/components/atoms/TeamIconChip.vue";
import { AvailableTimespan } from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "TimespanResume",
  components: { TeamIconChip },
  props: {
    timespan: {
      type: Object as () => AvailableTimespan,
      required: true,
    },
  },
  methods: {
    openFtNewTab(ftId: number) {
      window.open(`/ft/${ftId}`, "_blank");
    },
    teamSelectShortcut() {
      if (this.timespan.requestedTeams.length !== 1) return;
      const team = this.timespan.requestedTeams.at(0)?.code;
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

.timespan-name {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 8px;
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
