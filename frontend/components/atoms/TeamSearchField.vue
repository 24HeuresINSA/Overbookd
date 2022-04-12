<template>
  <v-combobox
    chips
    multiple
    dense
    clearable
    label="Team"
    style="padding: 2px"
    :items="getConfig('teams').map((e) => e.name)"
    @input="updateFilter('team', $event)"
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
      teams: this.getConfig("teams"),
    };
  },

  methods: {
    sendEvent(team: string) {
      this.$emit("input", team);
    },

    getRoleMetadata(roleName: string) {
      return this.teams.find((e: any) => e.name === roleName);
    },

    getConfig(key: string): any {
      return this.$accessor.config.getConfig(key);
    },
  },
});
</script>

<style></style>
