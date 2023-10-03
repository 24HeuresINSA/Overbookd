<template>
  <v-chip
    v-show="showTeam"
    :small="small"
    :large="large"
    :color="color"
    :class="classes"
    :close="close"
    :ripple="clickable"
    @click="sendEvent"
    @click:close="sendCloseEvent"
  >
    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-icon
          v-if="teamMetadate"
          :small="small"
          :large="large"
          v-bind="attrs"
          color="white"
          v-on="on"
        >
          {{ teamMetadate.icon }}
        </v-icon>
        <span v-if="withName" class="name">
          {{ teamMetadate.name }}
        </span>
      </template>
      <span>{{ teamMetadate?.name ?? "" }}</span>
    </v-tooltip>
  </v-chip>
</template>

<script lang="ts">
import Vue from "vue";
import { Team } from "~/utils/models/team.model";

export default Vue.extend({
  name: "TeamChip",
  props: {
    team: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: "small",
    },
    withName: {
      type: Boolean,
      default: false,
    },
    showHidden: {
      type: Boolean,
      default: false,
    },
    close: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    small(): boolean {
      return this.size === "small";
    },
    large(): boolean {
      return this.size === "large";
    },
    teamMetadate(): Team {
      return this.$accessor.team.getTeams([this.team])?.[0];
    },
    showTeam(): boolean {
      const hiddenTeams = ["benevole"];
      return this.showHidden || !hiddenTeams.includes(this.team);
    },
    color(): string {
      return this.teamMetadate?.color ?? "grey";
    },
    classes(): Record<string, boolean> {
      return {
        clickable: this.clickable,
        flip: this.team === "bde"
      };
    },
  },
  methods: {
    sendEvent() {
      this.$emit("click", this.teamMetadate);
    },
    sendCloseEvent() {
      this.$emit("close", this.team);
    },
  },
});
</script>

<style lang="scss" scoped>
.v-chip {
  margin-right: 2px;
  color: white;
  cursor: default;
}
span.name {
  color: white;
  margin-left: 4px;
}
.flip {
  transform: rotate(180deg);
}

.clickable {
  cursor: pointer;
}
</style>
