<template>
  <v-container>
    <h1>Stats 📈 (work in progess 🔨)</h1>
    <v-row class="d-flex justify-space-around pt-6">
      <h1>FA</h1>
      <v-switch v-model="switch1" @change="update" class="switch-width"></v-switch>
      <h1>FT</h1>
    </v-row>
    <Needs :dataset="dataset" :name="name"></Needs>
  </v-container>
</template>

<script>
import {safeCall} from "../utils/api/calls";
import {RepoFactory} from "../repositories/repoFactory";
import Needs from "../components/Needs";

export default {
  name: "Stats",
  components: {Needs},
  data() {
    return {
      switch1: false,
      dataset: [],
      name: "FA"
    };
  },
  async mounted() {
    await this.update();
  },
  methods: {
    async update(){
      let res;
      if(this.switch1){
        res = await safeCall(this.$store, RepoFactory.ftRepo.getFTsNumber(this));
        this.name = "FT";
      } else {
        res = await safeCall(this.$store, RepoFactory.faRepo.getFAsNumber(this));
        this.name = "FA";
      }
      this.dataset = res['data'];
    }
  }
};
</script>

<style scoped></style>
