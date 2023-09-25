<template>
  <div class="timeline-form">
    <fieldset>
      <legend>
        Plage horaire
        <v-btn icon color="pink" @click="refreshToNow">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </legend>
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

      <v-switch v-model="showOnlyMyTasks" label="Afficher mes FTs" />
    </fieldset>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { IProvidePeriod } from "@overbookd/period";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import { Team } from "~/utils/models/team.model";

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
    period(): IProvidePeriod {
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
    showOnlyMyTasks: {
      get(): boolean {
        return Boolean(this.$accessor.timeline.owner);
      },
      set(value: boolean) {
        const owner = value ? this.$accessor.user.me.id : null;
        this.$accessor.timeline.updateOwner(owner);
      },
    },
  },
  mounted() {
    this.refreshToNow();
  },
  methods: {
    updateTimelineFilter() {
      this.$accessor.timeline.updatePeriod(this.period);
    },
    setTimeRange() {
      this.start = this.$accessor.timeline.start;
      this.end = this.$accessor.timeline.end;
    },
    refreshToNow() {
      this.$accessor.timeline.resetToDefaultPeriod();
      this.setTimeRange();
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
      div,
      button {
        width: 100%;
      }
    }
  }
}
</style>
