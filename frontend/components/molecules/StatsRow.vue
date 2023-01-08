<template>
  <div>
    <v-row class="my-6 font-weight-bold">
      <v-col sm="2">Equipe</v-col>
      <v-col sm="7">
        <v-row>
          <v-col
            v-for="(status, key) in getAllStatus()"
            :key="key"
            class="flex-grow-1"
          >
            <StatsCard :status="status">{{ status }}</StatsCard>
          </v-col>
        </v-row>
      </v-col>
      <v-col sm="1" class="text-center">Total {{ name }}s N</v-col>
      <v-col sm="1" class="text-center">Total {{ name }}s N-1</v-col>
      <v-col sm="1" class="text-center">%</v-col>
    </v-row>
    <v-row v-for="com in dataset" :key="com.teamCode">
      <v-col sm="2">{{ teamName(com.teamCode) }}</v-col>
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
      <v-col sm="1" class="text-center">{{ history(com.teamCode) }}</v-col>
      <v-col sm="1" class="text-center">{{
        ((com.status["VALIDATED"] || 0) / history(com.teamCode)).toFixed(2)
      }}</v-col>
    </v-row>
  </div>
</template>

<script>
import StatsCard from "~/components/atoms/StatsCard";
import { Status as FAStatus } from "~/utils/models/FA";

export default {
  components: {
    StatsCard,
  },
  props: {
    name: { type: String, required: true },
    dataset: { type: Array, required: true },
  },
  data() {
    return {
      historyFA: {
        bar: 19,
        barrieres: 4,
        bureau: 1,
        catering: 1,
        communication: 3,
        concert: 2,
        courses: 16,
        culture: 20,
        dd: 28,
        deco: 7,
        elec: 3,
        hard: 2,
        humain: 1,
        maman: 5,
        matos: 6,
        payant: 3,
        plaizir: 13,
        scene: 9,
        secu: 16,
        signa: 2,
        sponso: 9,
        sports: 20,
        undefined: 0,
      },
      historyFT: {
        bar: 84,
        barrieres: 37,
        bureau: 3,
        catering: 8,
        communication: 27,
        concert: 8,
        courses: 58,
        culture: 86,
        dd: 56,
        deco: 16,
        elec: 25,
        hard: 5,
        humain: 10,
        maman: 9,
        matos: 61,
        payant: 18,
        plaizir: 45,
        scene: 87,
        secu: 76,
        signa: 28,
        sponso: 35,
        sports: 61,
        undefined: 46,
      },
    };
  },
  methods: {
    teamName(teamCode) {
      return this.$accessor.team.getTeamByCode(teamCode).name;
    },
    getAllStatus() {
      let status = FAStatus;
      // if (this.name === "FT") {
      //   status = FTStatus;
      // }
      // Change status for PascalCase
      return Object.keys(status).map(
        (w) => w[0].toUpperCase() + w.slice(1).toLowerCase()
      );
    },
    history(team) {
      if (this.name === "FT") {
        if (this.historyFT[team] === undefined) {
          return NaN;
        }
        return this.historyFT[team];
      }

      if (this.historyFA[team] === undefined) {
        return NaN;
      }
      return this.historyFA[team];
    },
  },
};
</script>
