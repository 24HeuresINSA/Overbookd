<template>
  <v-container>
  <h1>OverTinder 🔥</h1>
  <p>tu peux telecharger un constat de choppe directepement depuis ici</p>
  <v-card v-if="user" max-width="400">
    <v-img v-if="user.pp" :src=" ( getPPUrl() ) +  'api/user/pp/' + user.pp"></v-img>
    <v-card-title>
      {{user.nickname ? user.nickname : user.firstname}}
    </v-card-title>
    <v-card-text>
      <p>Charisme: {{user.charisma}}</p>
      <p>Situation Maritalle : {{user.isCouple}}</p>
      <p>sex : {{user.sex}}</p>
    </v-card-text>
    <v-card-actions style="display: flex; justify-content: space-between">
      <v-btn elevation="5" fab icon color="green" @click="next()"><v-icon>mdi-check</v-icon></v-btn>
      <v-btn elevation="5" fab icon color="red" @click="next(true)"><v-icon>mdi-cancel</v-icon></v-btn>
    </v-card-actions>
  </v-card>
  </v-container>
</template>

<script>
export default {
  name: "overTinder",

  data(){
    return {
      users: [],
      user: {
        nickname: undefined,
        charisma: 0,
        isCouple: undefined,
        sex: undefined
      }
    }
  },

  async mounted() {
    this.users = (await this.$axios('/user')).data;
    this.user = this.users[0];
    console.log(this.user)
  },

  methods: {
    getPPUrl(){
      return process.env.NODE_ENV === 'development' ? 'http://localhost:2424/' : ''
    },

    next(isLeft){
      this.user = this.users[Math.floor(Math.random()*this.users.length)];
    }
  }
}
</script>

<style scoped>

</style>