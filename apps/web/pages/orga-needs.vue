<template>
  <div class="orga-needs">
    <div>
      <h1>Rapport des besoins en orgas</h1>
    </div>
    <v-card-text class="datepicker">
      <div>
        <h3>Début du créneau</h3>
        <DateTimeField v-model="start" label="Début" />
      </div>

      <div>
        <h3>Fin du créneau</h3>
        <DateTimeField v-model="end" label="Fin" />
      </div>

      <v-btn color="success" class="btn" @click="updateStats"> Appliquer</v-btn>

      <SearchTeams
        :teams="teams"
        class="filters__field"
        :boxed="false"
        @change="changeTeams"
      ></SearchTeams>
    </v-card-text>
    <OrgaNeedsChart @select:orga-needs-details="selectDetails" />

    <v-dialog v-model="isDetailsOpen" max-width="1200">
      <OrgaNeedsDetailsCard
        v-if="selectedDetails"
        :orga-needs-details="selectedDetails"
        :filter-teams="teamCodes"
        @close-dialog="closeDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { ONE_DAY_IN_MS } from "@overbookd/period";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import OrgaNeedsChart from "~/components/organisms/orga-needs/OrgaNeedsChart.vue";
import OrgaNeedsDetailsCard from "~/components/organisms/orga-needs/OrgaNeedsDetailsCard.vue";
import { Team } from "~/utils/models/team.model";
import { OrgaNeedDetails } from "@overbookd/http";

const FOUR_DAYS_IN_MS = 4 * ONE_DAY_IN_MS;

type OrgaNeedsData = {
  start?: Date;
  end?: Date;
  teams: Team[];
  isDetailsOpen: boolean;
  selectedDetails?: OrgaNeedDetails;
};

export default Vue.extend({
  name: "OrgaNeeds",
  components: {
    DateTimeField,
    OrgaNeedsChart,
    SearchTeams,
    OrgaNeedsDetailsCard,
  },
  data(): OrgaNeedsData {
    return {
      start: undefined,
      end: undefined,
      teams: [],
      isDetailsOpen: false,
      selectedDetails: undefined,
    };
  },
  head: () => ({
    title: "Besoin orgas",
  }),
  computed: {
    stats(): OrgaNeedDetails[] {
      return this.$accessor.orgaNeeds.stats;
    },
    teamCodes(): string[] {
      return this.teams.map(({ code }) => code);
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.start = this.$accessor.configuration.eventStartDate;

    this.end = new Date(this.start.getTime() + FOUR_DAYS_IN_MS);
    this.updateStats();
  },
  methods: {
    changeTeams(teams: Team[]) {
      this.teams = teams;
      this.updateStats();
    },
    updateStats() {
      if (!this.start || !this.end) return;
      this.$accessor.orgaNeeds.fetchStats({
        start: this.start,
        end: this.end,
        teams: this.teamCodes,
      });
    },
    selectDetails(index: number) {
      const details = this.stats.at(index);
      if (!details) return;
      this.selectedDetails = details;
      this.isDetailsOpen = true;
    },
    closeDialog() {
      this.isDetailsOpen = false;
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
