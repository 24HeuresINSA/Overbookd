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
      FA: null,
      FT: null,
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
        // this.FT = (
        //   await safeCall(this.$store, RepoFactory.ftRepo.getFTsNumber(this))
        // )["data"];
        this.FT = [];
        this.name = "FT";
        this.dataset = this.FT;
      } else {
        this.FA = (await this.$accessor.FA.getFaStats()).data;
        this.name = "FA";
        this.dataset = this.FA;
      }
    },
  },
};
</script>

<style scoped></style>
