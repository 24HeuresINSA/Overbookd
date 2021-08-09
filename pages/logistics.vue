<template>
<v-container>
  <h1>La Log 🚚 (work in progess 🔨)</h1>

</v-container>
</template>

<script>
import {hasRole} from "../common/role";

export default {
  name: "logistics",

  data(){
    return {

    }
  },

  async mounted() {
    if(hasRole(this, 'log')){

    } else {
      await this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style scoped>

</style>