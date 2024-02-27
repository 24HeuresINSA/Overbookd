<template>
  <div>
    <v-row class="my-6 font-weight-bold">
      <v-col sm="2">Equipe</v-col>
      <v-col sm="7">
        <v-row>
          <v-col
            v-for="[status, label] in allStatusLabels"
            :key="status"
            class="flex-grow-1"
          >
            <StatsCard :status="status">{{ label }}</StatsCard>
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
            v-for="(count, status) in com.status"
            :key="status"
            :style="`flex-grow: ${count}`"
          >
            <StatsCard :status="status">
              {{ count }}
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
import Vue from "vue";
import {
  FestivalActivity,
  FestivalTask,
  VALIDATED,
} from "@overbookd/festival-event";
import { Item } from "@overbookd/list";
import StatsCard from "~/components/atoms/card/StatsCard.vue";
import { Team } from "~/utils/models/team.model";
import { StatsPayload } from "~/utils/models/stats.model";
import { faStatusLabels } from "~/utils/festival-event/festival-activity/festival-activity.model";
import { ftStatusLabels } from "~/utils/festival-event/festival-task/festival-task.model";

interface StatsRowData {
  historyFA: Map<string, number>;
  historyFT: Map<string, number>;
}

const validStatuses: string[] = [VALIDATED];

type FaOrFtStatsPayloads =
  | StatsPayload<FestivalActivity>[]
  | StatsPayload<FestivalTask>[];

export default Vue.extend({
  components: { StatsCard },
  props: {
    name: {
      type: String,
      required: true,
    },
    dataset: {
      type: Array as () => FaOrFtStatsPayloads,
      required: true,
    },
  },
  data(): StatsRowData {
    return {
      historyFA: new Map<string, number>([
        ["25eme", 1],
        ["admin", 1],
        ["accueil-artiste", 4],
        ["bar", 19],
        ["barrieres", 4],
        ["beboo", 5],
        ["bureau", 1],
        ["catering", 6],
        ["communication", 4],
        ["concert", 2],
        ["courses", 20],
        ["culture", 24],
        ["dd", 30],
        ["deco", 12],
        ["elec", 5],
        ["hard", 2],
        ["humain", 1],
        ["matos", 8],
        ["payant", 3],
        ["plaizir", 11],
        ["scene", 8],
        ["secu", 11],
        ["signa", 1],
        ["sponso", 10],
        ["sports", 30],
        ["undefined", 4],
      ]),
      historyFT: new Map<string, number>([
        ["25eme", 1],
        ["accueil-artiste", 29],
        ["bar", 83],
        ["barrieres", 25],
        ["beboo", 15],
        ["bureau", 7],
        ["catering", 9],
        ["communication", 26],
        ["concert", 22],
        ["conducteur-fen", 4],
        ["courses", 55],
        ["culture", 52],
        ["dd", 55],
        ["deco", 31],
        ["elec", 28],
        ["humain", 19],
        ["matos", 66],
        ["payant", 17],
        ["plaizir", 34],
        ["scene", 50],
        ["secu", 86],
        ["signa", 26],
        ["sponso", 25],
        ["sports", 66],
      ]),
    };
  },
  computed: {
    isFT(): boolean {
      return this.name === "FT";
    },
    allStatusLabels(): typeof faStatusLabels | typeof ftStatusLabels {
      return this.isFT ? ftStatusLabels : faStatusLabels;
    },
    teamStats(): FaOrFtStatsPayloads {
      return this.dataset;
    },
  },
  methods: {
    team(teamCode: string): Team | undefined {
      return this.$accessor.team.getTeamByCode(teamCode);
    },
    history(teamCode: string): number | undefined {
      return this.isFT
        ? this.historyFT.get(teamCode)
        : this.historyFA.get(teamCode);
    },
    displayHistory(teamCode?: string): number | string {
      const lastYearValue = this.history(teamCode ?? "undefined");
      return lastYearValue ?? "N/A";
    },
    historyPercentage(stats: Item<FaOrFtStatsPayloads>): string {
      const lastYearCount = this.history(stats.teamCode);
      if (!lastYearCount || lastYearCount === 0) {
        return "N/A";
      }

      const countAtLeastValidated = Object.entries(stats.status).reduce(
        (acc, [status, count]) =>
          validStatuses.includes(status) ? acc + count : acc,
        0,
      );

      return (
        (((countAtLeastValidated || 0) * 100) / lastYearCount).toFixed(0) + "%"
      );
    },
    toPascalCase(str: string): string {
      return `${str.at(0)?.toUpperCase()}${str.slice(1).toLowerCase()}`;
    },
  },
});
</script>
