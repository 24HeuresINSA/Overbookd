<template>
  <v-chip
    small
    :color="getTeamMetadate(team) ? getTeamMetadate(team).color : 'grey'"
    @click="sendEvent"
  >
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon v-if="getTeamMetadate(team)" small v-bind="attrs" v-on="on">
          {{ getTeamMetadate(team).icon }}
        </v-icon>
      </template>
      <span>{{ getTeamMetadate(team) ? getTeamMetadate(team).name : "" }}</span>
    </v-tooltip>
  </v-chip>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "MiniUserBadge",
  props: {
    team: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    getTeamMetadate(team: string): any {
      const teamsConfig = this.$accessor.config.getConfig("teams");
      return teamsConfig.find((item: { name: string }) => item.name === team);
    },
    sendEvent() {
      this.$emit("click", this.team);
    },
  },
});
</script>

<style></style>
