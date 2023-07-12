<template>
  <div class="orga-needs">
    <div>
      <h1>Rapport des besoins en orgas</h1>
    </div>
    <v-card-text class="datepicker">
      <div>
        <h3>Début du créneau</h3>
        <DateTimeField v-model="start" label="Début"></DateTimeField>
      </div>

      <div>
        <h3>Fin du créneau</h3>
        <DateTimeField v-model="end" label="Fin"></DateTimeField>
      </div>

      <v-btn color="success" class="btn" @click="updateStats"> Appliquer</v-btn>

      <SearchTeams
        :value="teams"
        class="filters__field"
        :boxed="false"
        @change="changeTeams"
      ></SearchTeams>
    </v-card-text>
    <OrgaNeedsChart></OrgaNeedsChart>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { OrgaNeedsResponse } from "~/store/orgaNeeds";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import OrgaNeedsChart from "~/components/organisms/orga-needs/OrgaNeedsChart.vue";
import { Team } from "~/utils/models/team";
import { ONE_DAY_IN_MS } from "~/utils/date/dateUtils";

const FOUR_DAYS_IN_MS = 4 * ONE_DAY_IN_MS;

export default Vue.extend({
  name: "OrgaNeeds",
  components: { DateTimeField, OrgaNeedsChart, SearchTeams },
  data() {
    return {
      start: undefined as Date | undefined,
      end: undefined as Date | undefined,
      teams: [] as string[],
    };
  },
  computed: {
    stats(): OrgaNeedsResponse[] {
      return this.$accessor.orgaNeeds.stats;
    },
  },
  mounted() {
    this.start = new Date(this.$accessor.configuration.get("eventDate")?.start);
    this.end = new Date(this.start.getTime() + FOUR_DAYS_IN_MS);
    this.updateStats();
  },
  methods: {
    changeTeams(teams: Team[]) {
      this.teams = teams.map((team) => team.code);
      this.updateStats();
    },
    updateStats() {
      if (!this.start || !this.end) return;
      this.$accessor.orgaNeeds.fetchStats({
        start: this.start,
        end: this.end,
        teams: this.teams,
      });
    },
  },
});
</script>

<style scoped>
.datepicker {
  display: flex;
  gap: 2rem;
  align-items: center;
}
</style>
