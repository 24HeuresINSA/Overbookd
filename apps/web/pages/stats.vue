<template>
  <v-container>
    <h1>Stats 📈</h1>
    <v-row class="d-flex justify-space-around pt-6">
      <h1>FA</h1>
      <v-switch
        v-model="switchType"
        class="switch-width"
        @change="update"
      ></v-switch>
      <h1>FT</h1>
    </v-row>
    <StatsRow :dataset="dataset" :name="name" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { StatsPayload } from "~/utils/festival-event/stats";
import StatsRow from "~/components/molecules/stats/StatsRow.vue";
import { FestivalActivity, FestivalTask } from "@overbookd/festival-event";

export default Vue.extend({
  name: "Stats",
  components: { StatsRow },
  data() {
    return {
      switchType: false,
      dataset: [] as
        | StatsPayload<FestivalActivity>[]
        | StatsPayload<FestivalTask>[],
      name: "FA",
    };
  },
  head: () => ({
    title: "Statistiques",
  }),
  async mounted() {
    await this.update();
  },
  methods: {
    async update() {
      if (this.switchType) {
        this.name = "FT";
        this.dataset = await this.getStatsFT();
      } else {
        this.name = "FA";
        this.dataset = await this.getStatsFA();
      }
    },
    async getStatsFA() {
      if (this.$accessor.stats.statsFA.length === 0) {
        await this.$accessor.stats.getFaStats();
      }
      return this.$accessor.stats.statsFA;
    },
    async getStatsFT() {
      if (this.$accessor.stats.statsFT.length === 0) {
        await this.$accessor.stats.getFtStats();
      }
      return this.$accessor.stats.statsFT;
    },
  },
});
</script>

<style scoped></style>
