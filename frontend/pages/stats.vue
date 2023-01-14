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
    <h1 v-if="switchType">Les stats FT ne sont pas encore disponibles</h1>
  </v-container>
</template>

<script>
import StatsRow from "~/components/molecules/StatsRow";

export default {
  name: "Stats",
  components: { StatsRow },
  data() {
    return {
      switchType: false,
      dataset: [],
      name: "FA",
    };
  },
  async mounted() {
    if (!this.$accessor.user.hasPermission("hard")) {
      await this.$router.push({
        path: "/",
      });
    }
    await this.update();
  },
  methods: {
    async update() {
      if (this.switchType) {
        this.name = "FT";
        this.dataset = [];
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
  },
};
</script>

<style scoped></style>
