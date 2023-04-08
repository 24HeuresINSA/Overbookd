<template>
  <v-chip
    :small="small"
    :large="large"
    :color="getTeamMetadate(team) ? getTeamMetadate(team).color : 'grey'"
    @click="sendEvent"
  >
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon
          v-if="getTeamMetadate(team)"
          :small="small"
          :large="large"
          v-bind="attrs"
          color="white"
          v-on="on"
        >
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
  name: "TeamIconChip",
  props: {
    team: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "small",
    },
  },
  computed: {
    small(): boolean {
      return this.size === "small";
    },
    large(): boolean {
      return this.size === "large";
    },
  },
  methods: {
    getTeamMetadate(team: string): any {
      return this.$accessor.team.getTeams([team])?.[0];
    },
    sendEvent() {
      this.$emit("click", this.team);
    },
  },
});
</script>

<style lang="scss" scoped>
.v-chip {
  margin-right: 2px;
}
</style>
