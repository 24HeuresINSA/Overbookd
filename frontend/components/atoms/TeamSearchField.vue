<template>
  <v-combobox
    chips
    multiple
    dense
    clearable
    label="Team"
    style="padding: 2px"
    :items="teams.map((team) => team.name)"
    :value="selectedTeam"
    @input="sendEvent($event)"
  >
    <template #selection="{ attrs, item, selected }">
      <v-chip
        v-bind="attrs"
        :input-value="selected"
        :color="getRoleMetadata(item).color"
      >
        <v-icon left color="white">
          {{ getRoleMetadata(item).icon }}
        </v-icon>
        <a style="color: white">
          {{ getRoleMetadata(item).name }}
        </a>
      </v-chip>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "TeamSearchField",
  data() {
    return {
      teams: this.$accessor.team.getAllTeams,
    };
  },
  computed: {
    selectedTeam() {
      return this.$accessor.assignment.filters.FT.team;
    },
  },

  methods: {
    sendEvent(event: any): any {
      this.$emit("input", event);
    },

    getRoleMetadata(roleName: string): any {
      return this.teams.find((e: any) => e.name === roleName);
    },
  },
});
</script>

<style></style>
