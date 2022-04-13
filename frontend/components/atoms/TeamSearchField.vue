<template>
  <v-combobox
    chips
    multiple
    dense
    clearable
    label="Team"
    style="padding: 2px"
    :items="getConfig('teams').map((e) => e.name)"
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
      //Not doing this causes bugs
      teams: (this as any).getConfig("teams"),
    };
  },

  methods: {
    sendEvent(event: any): any {
      this.$emit("input", event);
    },

    getRoleMetadata(roleName: string): any {
      return this.teams.find((e: any) => e.name === roleName);
    },

    getConfig(key: string): any {
      return this.$accessor.config.getConfig(key);
    },
  },
  computed: {
    selectedTeam() {
      return this.$accessor.assignment.filters.FT.team;
    },
  },
});
</script>

<style></style>
