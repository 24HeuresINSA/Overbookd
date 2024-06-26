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
          v-if="teamMetadata"
          :small="small"
          :large="large"
          v-bind="attrs"
          color="white"
          v-on="on"
        >
          {{ teamMetadata.icon }}
        </v-icon>
        <span v-if="withName" class="name">
          {{ teamText }}
        </span>
      </template>
      <span>{{ teamText }}</span>
    </v-tooltip>
  </v-chip>
</template>

<script lang="ts">
import Vue from "vue";
import { BENEVOLE_CODE } from "@overbookd/team";
import { Team } from "@overbookd/http";

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
    prefix: {
      type: String,
      default: null,
    },
  },
  computed: {
    small(): boolean {
      return this.size === "small";
    },
    large(): boolean {
      return this.size === "large";
    },
    teamMetadata(): Team | undefined {
      return this.$accessor.team.getTeamByCode(this.team);
    },
    showTeam(): boolean {
      const hiddenTeams = [BENEVOLE_CODE];
      return this.showHidden || !hiddenTeams.includes(this.team);
    },
    teamText(): string {
      const prefix = this.prefix ? `${this.prefix} ` : "";
      return `${prefix}${this.teamMetadata?.name}`;
    },
    color(): string {
      return this.teamMetadata?.color ?? "grey";
    },
    classes(): Record<string, boolean> {
      return {
        clickable: this.clickable,
        flip: this.team === "bde",
      };
    },
  },
  methods: {
    sendEvent() {
      this.$emit("click", this.teamMetadata);
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
