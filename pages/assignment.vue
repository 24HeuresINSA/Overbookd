<template>
  <v-container>
    <!-- list of  filtered users -->
    <v-card>
      <v-list-item v-for="user of filteredUsers">
        <v-list-item-content>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-container>
</template>

<script>
import {hasRole} from "../common/role";

export default {
  name: "assignment",
  data(){
    return {
      users: [],
      filteredUsers: [],
    }
  },

  async mounted(){
    // TODO
    // if(!this.hasRole('hard')){
    //   alert("you don't have the role 'hard' to access this page");
    //   this.router.push({
    //     // to:
    //   })
    // } else
    console.log(hasRole(this, 'hard'))

  },

  methods:{
  }
}
</script>

<style scoped>

</style>