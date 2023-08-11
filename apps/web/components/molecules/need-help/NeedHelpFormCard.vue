<template>
  <v-card class="need">
    <v-card-title> Besoin </v-card-title>
    <v-card-text class="forms">
      <fieldset>
        <legend>Plage horaire</legend>
        <DateTimeField v-model="start" label="Début" :boxed="false" />
        <DateTimeField v-model="end" label="Fin" :boxed="false" />
        <v-btn color="success" class="btn" @click="getVolunteers">
          Appliquer
        </v-btn>
      </fieldset>
      <fieldset>
        <legend>Filtres</legend>
        <SearchTeams
          v-model="teams"
          label="Filtrer par équipe"
          :boxed="false"
        />
        <v-text-field
          v-model="search"
          append-icon="mdi-outline-search"
          label="Nom du bénévole"
          clearable
          clear-icon="mdi-close-circle-outline"
          :solo="false"
          :filled="false"
        ></v-text-field>
      </fieldset>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { IProvidePeriod } from "@overbookd/period";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import { Team } from "~/utils/models/team";

export default Vue.extend({
  name: "NeedHelpFormCard",
  components: { DateTimeField, SearchTeams },
  data: () => {
    return {
      start: new Date(),
      end: new Date(),
    };
  },
  computed: {
    period(): IProvidePeriod {
      return {
        start: this.start,
        end: this.end,
      };
    },
    search: {
      get(): string {
        return this.$accessor.needHelp.search;
      },
      set(value: string | null) {
        this.$accessor.needHelp.updateSearch(value);
      },
    },
    teams: {
      get(): Team[] {
        return this.$accessor.needHelp.teams;
      },
      set(value: Team[]) {
        this.$accessor.needHelp.updateTeams(value);
      },
    },
  },
  mounted() {
    this.refreshToNow();
  },
  methods: {
    getVolunteers() {
      this.$accessor.needHelp.updatePeriod(this.period);
    },
    setTimeRange() {
      this.start = this.$accessor.needHelp.start;
      this.end = this.$accessor.needHelp.end;
    },
    refreshToNow() {
      this.$accessor.needHelp.resetToDefaultPeriod();
      this.setTimeRange();
    },
  },
});
</script>

<style lang="scss" scoped>
.forms {
  position: sticky;
  top: $header-height;
  @media (width <= 900px) {
    top: $mobile-header-height;
  }
}

fieldset {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  @media (width <= 900px) {
    gap: 3px;
  }
}
</style>
