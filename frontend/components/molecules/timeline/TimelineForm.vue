<template>
  <div class="timeline-form">
    <div>
      <h3>Début de la plage horaire</h3>
      <DateTimeField v-model="start" label="Début" />
    </div>

    <div>
      <h3>Fin de la plage horaire</h3>
      <DateTimeField v-model="end" label="Fin" />
    </div>

    <v-btn color="success" class="btn" @click="updateTimelineFilter">
      Appliquer
    </v-btn>

    <v-text-field
      v-model="search"
      append-icon="mdi-outline-search"
      label="Nom de la tache"
      clearable
      clear-icon="mdi-close-circle-outline"
    ></v-text-field>

    <SearchTeams v-model="teams" label="Filtrer par équipe" :boxed="false" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import { Period } from "~/utils/models/period";
import { Team } from "~/utils/models/team";

export default Vue.extend({
  name: "TimelineForm",
  components: { DateTimeField, SearchTeams },
  data() {
    return {
      start: new Date(),
      end: new Date(),
    };
  },
  computed: {
    period(): Period {
      return {
        start: this.start,
        end: this.end,
      };
    },
    search: {
      get(): string {
        return this.$accessor.timeline.search;
      },
      set(value: string | null) {
        this.$accessor.timeline.updateSearch(value);
      },
    },
    teams: {
      get(): Team[] {
        return this.$accessor.timeline.teams;
      },
      set(value: Team[]) {
        this.$accessor.timeline.updateTeams(value);
      },
    },
  },
  created() {
    this.start = this.$accessor.timeline.start;
    this.end = this.$accessor.timeline.end;
  },
  methods: {
    updateTimelineFilter() {
      this.$accessor.timeline.updatePeriod(this.period);
    },
  },
});
</script>

<style lang="scss" scoped>
.timeline-form {
  display: flex;
  gap: 70px;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
}
</style>
