<template>
  <div>
    <div class="d-flex">
      <v-btn-toggle
          class="justify-center"
          v-model="datepicker"
          multiple
          dense
          @change="loadDay"
      >
        <v-btn class="flex-grow-1" v-for="i in Array.from(Array(31).keys())" :key="i">{{i+1}}</v-btn>
      </v-btn-toggle>
    </div>
  </div>
</template>

<script>
import {safeCall} from "../utils/api/calls";
import {RepoFactory} from "../repositories/repoFactory";

export default {
  name: "organeeds.vue",
  data() {
    return {
      datepicker: [19,20,21,22],
    };
  },
  methods: {
    async loadDay(){
      for (const day of this.datepicker) {
        const timestamp = new Date((new Date()).getFullYear(), 4, (day+1)).getTime();
        const res = (await safeCall(this.$store, RepoFactory.timeslotRepo.getOrgaNeeds(this, timestamp)))['data'];
        console.log(res);
      }
    }
  },
}
</script>

<style scoped>

</style>