<template>
  <v-autocomplete
    :value="team"
    :items="teams"
    :loading="loading"
    item-text="name"
    chips
    clearable
    item-value="code"
    :label="label"
    :solo="boxed"
    :filled="boxed"
    :disabled="disabled"
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
import { Team } from "~/utils/models/team";

interface SearchTeamData {
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
      type: Object as () => Team | null,
      default: null,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
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
    propagateEvent(team: Team | null) {
      this.$emit("change", team);
    },
  },
});
</script>
