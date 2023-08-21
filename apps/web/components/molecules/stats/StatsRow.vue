<template>
  <div>
    <v-row class="my-6 font-weight-bold">
      <v-col sm="2">Equipe</v-col>
      <v-col sm="7">
        <v-row>
          <v-col
            v-for="(displayedStatus, status) in allStatus"
            :key="status"
            class="flex-grow-1"
          >
            <StatsCard :status="status">{{ displayedStatus }}</StatsCard>
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="1" class="text-center">Total {{ name }}s N</v-col>
      <v-col sm="1" class="text-center">Total {{ name }}s N-1</v-col>
      <v-col sm="1" class="text-center">%</v-col>
    </v-row>
    <v-row v-for="com in teamStats" :key="com.teamCode">
      <v-col sm="2">{{ team(com.teamCode)?.name || "Sans équipe" }}</v-col>
      <v-col sm="7">
        <div class="d-flex">
          <div
            v-for="(element, i) in com.status"
            :key="i"
            :style="`flex-grow: ${element.count}`"
          >
            <StatsCard :status="element.status">
              {{ element.count }}
            </StatsCard>
          </div>
        </div>
      </v-col>
      <v-col sm="1" class="text-center">{{ com.total }}</v-col>
      <v-col sm="1" class="text-center">{{
        displayHistory(com.teamCode)
      }}</v-col>
      <v-col sm="1" class="text-center">{{ historyPercentage(com) }}</v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Team } from '~/utils/models/team';
import { StatsPayload } from '~/utils/models/stats';
import { FaStatusLabel } from '~/utils/models/fa';
import StatsCard from '~/components/atoms/card/StatsCard.vue';

interface StatsRowData {
  historyFA: Map<string, number>;
  historyFT: Map<string, number>;
}

export default Vue.extend({
  components: {
    StatsCard,
  },
  props: {
    name: {
      type: String,
      required: true,
    },
    dataset: {
      type: Array as () => StatsPayload[],
      required: true,
    },
  },
  data(): StatsRowData {
    return {
      historyFA: new Map<string, number>([
        ['bar', 19],
        ['barrieres', 4],
        ['bureau', 1],
        ['catering', 1],
        ['communication', 3],
        ['concert', 2],
        ['courses', 16],
        ['culture', 20],
        ['dd', 28],
        ['deco', 7],
        ['elec', 3],
        ['hard', 2],
        ['humain', 1],
        ['beboo', 5],
        ['matos', 6],
        ['payant', 3],
        ['plaizir', 13],
        ['scene', 9],
        ['secu', 16],
        ['signa', 2],
        ['sponso', 9],
        ['sports', 20],
        ['undefined', 0],
      ]),
      historyFT: new Map<string, number>([
        ['bar', 84],
        ['barrieres', 37],
        ['bureau', 3],
        ['catering', 8],
        ['communication', 27],
        ['concert', 8],
        ['courses', 58],
        ['culture', 86],
        ['dd', 56],
        ['deco', 16],
        ['elec', 25],
        ['hard', 5],
        ['humain', 10],
        ['beboo', 9],
        ['matos', 61],
        ['payant', 18],
        ['plaizir', 45],
        ['scene', 87],
        ['secu', 76],
        ['signa', 28],
        ['sponso', 35],
        ['sports', 61],
        ['undefined', 46],
      ]),
    };
  },
  computed: {
    allStatus(): typeof FaStatusLabel {
      return FaStatusLabel;
    },
    teamStats(): StatsPayload[] {
      return this.dataset;
    },
  },
  methods: {
    team(teamCode: string): Team | undefined {
      return this.$accessor.team.getTeamByCode(teamCode);
    },
    history(teamCode: string): number | undefined {
      if (this.name === 'FT') {
        return this.historyFT.get(teamCode);
      }

      return this.historyFA.get(teamCode);
    },
    displayHistory(teamCode: string): string {
      const lastYearValue = this.history(teamCode);
      return lastYearValue ? lastYearValue.toString() : 'N/A';
    },
    historyPercentage(stats: StatsPayload): string {
      const lastYearCount = this.history(stats.teamCode);
      if (!lastYearCount || lastYearCount === 0) {
        return 'N/A';
      }

      const validatedNumber = stats.status.find(
        (s) => s.status === 'VALIDATED'
      )?.count;

      return (((validatedNumber || 0) * 100) / lastYearCount).toFixed(0) + '%';
    },
    toPascalCase(str: string): string {
      return `${str.at(0)?.toUpperCase()}${str.slice(1).toLowerCase()}`;
    },
  },
});
</script>
