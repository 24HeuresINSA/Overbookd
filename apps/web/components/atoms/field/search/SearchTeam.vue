<template>
  <v-autocomplete
    :value="team"
    :items="teams"
    :loading="loading"
    item-text="name"
    item-value="code"
    chips
    clearable
    :label="label"
    :solo="boxed"
    :filled="boxed"
    :disabled="disabled"
    :hide-details="hideDetails"
    return-object
    :filter="filterTeams"
    @change="propagateEvent"
  >
    <template #selection="{ item }">
      <TeamChip :team="item.code" with-name show-hidden />
    </template>
    <template #no-data>
      <v-list-item> Aucune equipe correspondante </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { SlugifyService } from "@overbookd/slugify";
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { Team } from "~/utils/models/team.model";

type SearchTeamData = {
  loading: boolean;
}

export default Vue.extend({
  name: "SearchTeam",
  components: { TeamChip },
  model: {
    prop: "team",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher une équipe",
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
    hideDetails: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array as () => Team[] | null,
      default: null,
    },
  },
  data(): SearchTeamData {
    return {
      loading: false,
    };
  },
  computed: {
    teams(): Team[] {
      return this.list ?? this.$accessor.team.teams;
    },
  },
  mounted() {
    if (this.teams.length) return;
    this.$accessor.team.fetchTeams();
  },
  methods: {
    propagateEvent(team: Team | null) {
      this.$emit("change", team);
    },
    filterTeams(team: Team, typedSearch: string) {
      const search = SlugifyService.apply(typedSearch);
      return SlugifyService.apply(team.name).includes(search);
    },
  },
});
</script>
