<template>
  <v-container>
<<<<<<< HEAD
    <h1>Stats 📈 (work in progress 🔨)</h1>
    <h2>Overbookd</h2>
    <h3>Nombre de crash</h3>
    <v-container style="height: 400px">
      <OverBarChart :chart-data="crashData"></OverBarChart>
    </v-container>

    <h2>FA</h2>
    <v-container style="height: 400px">
      <OverBarChart :chart-data="FAData"></OverBarChart>
    </v-container>

    <h2>FT</h2>
    <v-container style="height: 400px">
      <OverBarChart :chart-data="FTData"></OverBarChart>
    </v-container>
=======
    <h1>Stats 📈 (work in progess 🔨)</h1>
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
>>>>>>> 3e96962604cb87460febce33af820efeb12b05ed
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
    await this.update();
  },
  methods: {
    async update() {
      if (this.switchType) {
        this.FT =
          this.FT ||
          (await safeCall(this.$store, RepoFactory.ftRepo.getFTsNumber(this)))[
            "data"
          ];
        this.name = "FT";
        this.dataset = this.FT;
      } else {
        this.FA =
          this.FA ||
          (await safeCall(this.$store, RepoFactory.faRepo.getFAsNumber(this)))[
            "data"
          ];
        this.name = "FA";
        this.dataset = this.FA;
      }
    },
  },
};
</script>

<style scoped></style>
