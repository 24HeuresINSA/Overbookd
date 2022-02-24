<template>
  <v-container>
    <h1>Stats 📈 (work in progess 🔨)</h1>
    <v-row class="d-flex justify-space-around pt-6">
      <h1>FA</h1>
      <v-switch v-model="switch1" class="switch-width"></v-switch>
      <h1>FT</h1>
    </v-row>
    <Needs :dataset="data"></Needs>
  </v-container>
</template>

<script>
import FTChart from "../components/FTChart.vue";
import {safeCall} from "../utils/api/calls";
import {RepoFactory} from "../repositories/repoFactory";
import Needs from "../components/Needs";

export default {
  name: "Stats",
  components: {Needs, FTChart},
  data() {
    return {
      switch1: false,
      data: []
    };
  },
  async mounted() {
    const res = await safeCall(this.$store, RepoFactory.faRepo.getFAsNumber(this));
    if (res) {
      this.data = res['data'];
    } else {
      alert("error");
    }
  },
};
</script>

<style scoped></style>
