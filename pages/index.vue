<template>
  <v-row justify="center" align="center">
    <v-col cols="6" sm="4" md="3">
      <v-card v-if="user">
        <v-card-title>Bonsoir {{user.nickname ? user.nickname : user.firstname}}</v-card-title>
        <v-card-subtitle> {{user.email}}</v-card-subtitle>
        <v-card-text>
          <p>Charisme: {{user.charisma}}</p>
          <v-chip-group>
            <v-chip v-for="team in user.team">
              {{team}}
            </v-chip>
          </v-chip-group>
          <v-progress-linear value="15"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="6" sm="4" md="3">

    </v-col>
  </v-row>
</template>

<script>
import jwt_decode from "jwt-decode";

export default {
  components: {},

  data(){
    return {
      user: undefined,
    }
  },

  async mounted() {
    const keycloakID = this.getUsername();
    this.user = await this.getUser(keycloakID)
    console.log(this.user)
  },

  methods: {
    getUsername(){
      const token = this.$auth.$storage._state["_token.keycloak"].split(' ')[1]
      const decoded = jwt_decode(token)
      return decoded.sub
    },

    async getUser(keycloakID){
      return this.$axios.$get(`/user/${keycloakID}`)
    }
  },
};
</script>
<style>

</style>