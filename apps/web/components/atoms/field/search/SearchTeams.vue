<template>
  <v-combobox
    :value="teams"
    :items="allTeams"
    :loading="loading"
    item-text="name"
    item-value="code"
    multiple
    chips
    clearable
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
  </v-combobox>
</template>

<script lang="ts">
import Vue from "vue";
import { Team } from "~/utils/models/team.model";

interface SearchTeamData {
  loading: boolean;
}

export default Vue.extend({
  name: "SearchTeams",
  model: {
    prop: "teams",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher des équipes",
    },
    teams: {
      type: Array as () => Team[],
      default: () => [],
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
    allTeams(): Team[] {
      return this.$accessor.team.teams;
    },
  },
  mounted() {
    if (this.allTeams.length) return;
    this.$accessor.team.fetchTeams();
  },
  methods: {
    propagateEvent(teams: Team[]) {
      this.$emit("change", teams);
    },
  },
});
</script>
