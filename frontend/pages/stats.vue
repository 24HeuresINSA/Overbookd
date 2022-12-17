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
    <Needs :dataset="dataset" :name="name"></Needs>
  </v-container>
</template>

<script>
import { safeCall } from "../utils/api/calls";
import { RepoFactory } from "../repositories/repoFactory";
import Needs from "../components/Needs";

export default {
  name: "Stats",
  components: { Needs },
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
    if (this.$accessor.user.hasPermission("hard")) {
      await this.update();
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },
  methods: {
    async update() {
      if (this.switchType) {
        this.FT = (
          await safeCall(this.$store, RepoFactory.ftRepo.getFTsNumber(this))
        )["data"];
        this.name = "FT";
        this.dataset = this.FT;
      } else {
        this.FA = (
          await safeCall(this.$store, RepoFactory.faRepo.getFAsNumber(this))
        )["data"];
        this.name = "FA";
        this.dataset = this.FA;
      }
    },
  },
};
</script>

<style scoped></style>
