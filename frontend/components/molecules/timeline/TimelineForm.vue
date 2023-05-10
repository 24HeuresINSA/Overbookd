<template>
  <div class="timeline-form">
    <fieldset>
      <legend>Plage horaire</legend>
      <DateTimeField v-model="start" label="Début" :boxed="false" />

      <DateTimeField v-model="end" label="Fin" :boxed="false" />

      <v-btn color="success" class="btn" @click="updateTimelineFilter">
        Appliquer
      </v-btn>
    </fieldset>

    <fieldset>
      <legend>Filtres</legend>
      <v-text-field
        v-model="search"
        append-icon="mdi-outline-search"
        label="Nom de la tache"
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>

      <SearchTeams v-model="teams" label="Filtrer par équipe" :boxed="false" />
    </fieldset>
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
  top: $header-height;
  display: flex;
  gap: 20px;
  @media (width <= 900px) {
    gap: 5px;
    flex-direction: column;
    top: $mobile-header-height;
  }

  fieldset {
    display: flex;
    gap: 40px;
    align-items: center;
    padding: 10px;
    @media (width <= 900px) {
      gap: 3px;
      flex-direction: column;
    }
    div {
      width: 100%;
    }
  }
}
</style>
