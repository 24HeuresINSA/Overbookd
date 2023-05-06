<template>
  <v-card class="need">
    <v-card-title> Besoin </v-card-title>
    <v-card-text>
      <fieldset>
        <legend>Plage horaire</legend>
        <DateTimeField v-model="start" label="Début" :boxed="false" />
        <DateTimeField v-model="end" label="Fin" :boxed="false" />
        <v-btn color="success" class="btn"> Appliquer </v-btn>
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
          autofocus
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
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import { Team } from "~/utils/models/team";

export default Vue.extend({
  name: "NeedCard",
  components: { DateTimeField, SearchTeams },
  data: () => {
    return {
      start: new Date(),
      end: new Date(),
      teams: [] as Team[],
      search: "",
    };
  },
});
</script>

<style lang="scss" scoped>
fieldset {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}
</style>
