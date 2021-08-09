<template>
<v-container>
  <h1>La Log 🚚 (work in progess 🔨)</h1>

  <v-select label="item a verifier"></v-select>

  <over-chart :chart-data="datacollection"></over-chart>

  <v-data-table
    :headers="headers"
  ></v-data-table>

</v-container>
</template>

<script>
import {hasRole} from "../common/role";

export default {
  name: "logistics",

  data(){
    return {
      headers: [{
      }],
    }
  },

  async mounted() {
    if(hasRole(this, 'log')){
      const {data} = await this.$axios.get('/ft');
      console.log(data);



    } else {
      await this.$router.push({
        path: '/'
      })
    }
  },

  methods: {
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<style scoped>

</style>