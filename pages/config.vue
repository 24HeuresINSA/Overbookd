<template>
  <v-container>
    <h1>Config ⚙️ (work in progress)</h1>

    <v-img height="500" src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"></v-img>

    <h2>Inscription</h2>
    <v-switch label="Ouverture des inscription" v-model="config.isSignupOpen"></v-switch>
    <v-text-field label="message de fermeture" v-model="config.fb_signup_closed"></v-text-field>
  </v-container>
</template>

<script>
import {getConfig, hasRole} from "../common/role";

export default {
  name: "config",

  data(){
    return {
      config: {
        isSignupOpen: getConfig(this, 'isSignupOpen'),
        fb_signup_closed: getConfig(this, 'fb_signup_closed'),
      }
    }
  },

  async mounted() {
    if(hasRole(this, ['admin', 'bureau'])){

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