<template>
  <v-autocomplete
    :value="team"
    :items="teams"
    :loading="loading"
    item-text="name"
    chips
    clearable
    filled
    item-value="code"
    :label="label"
    solo
    return-object
    @change="propagateEvent"
  >
    <template #no-data>
      <v-list-item> Aucune equipe correspondante </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { team } from "~/utils/models/repo";

interface SearchTeamData {
  team?: team;
  loading: boolean;
}

export default Vue.extend({
  name: "SearchTeam",
  model: {
    prop: "team",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher une equipe",
    },
    team: {
      type: Object,
      default: undefined,
    },
  },
  data(): SearchTeamData {
    return {
      loading: false,
    };
  },
  computed: {
    teams() {
      return this.$accessor.team.teams;
    },
  },
  mounted() {
    if (this.teams.length) return;
    this.$accessor.team.setTeamsInStore();
  },
  methods: {
    propagateEvent(team: team) {
      this.$emit("change", team);
    },
  },
});
</script>
