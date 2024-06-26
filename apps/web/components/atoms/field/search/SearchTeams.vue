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
    :hide-details="hideDetails"
    return-object
    @change="propagateEvent"
  >
    <template #selection="{ item }">
      <TeamChip
        :team="item.code"
        with-name
        show-hidden
        close
        @close="propagateEventWithoutTeam"
      />
    </template>
    <template #no-data>
      <v-list-item> Aucune équipe correspondante </v-list-item>
    </template>
  </v-combobox>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "../../chip/TeamChip.vue";
import { Team } from "@overbookd/http";

type SearchTeamData = {
  loading: boolean;
};

export default Vue.extend({
  name: "SearchTeams",
  components: { TeamChip },
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
    hideDetails: {
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
    propagateEventWithoutTeam(team: string) {
      const teams = this.teams.filter((t) => t.code !== team);
      this.propagateEvent(teams);
    },
  },
});
</script>
