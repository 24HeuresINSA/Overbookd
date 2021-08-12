<template>
  <div>
    <h1>Fiche Tache 👻</h1>
    <v-data-table
      :headers="headers"
      :items="FTs"
    >
      <template v-slot:item.action="row">
          <v-btn
              style="margin: 5px"
              icon
              small
              :to="'/ft/' + row.item._id">
          ><v-icon>mdi-text-search</v-icon></v-btn>
        <v-btn
            icon
            small
            @click="selectedFTID = row.item._id; isDialogOpen = true;"
        ><v-icon>mdi-trash-can</v-icon></v-btn>

      </template>
    </v-data-table>

    <v-dialog v-model="isDialogOpen" width="600">
      <v-card>
      <v-img src="sure.jpeg"></v-img>
        <v-card-title>t'es sûr bébé ?</v-card-title>
        <v-card-actions>
          <v-btn right text @click="deleteFT()">oui 😏</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
const {hasRole} = require("../../common/role");
export default {
  name: "index",
  data(){
    return {
      headers: [{
        text: 'Status',
        value: 'status',
      },{
        text: 'Nom',
        value: 'name',
      },{
        text: 'Resp',
        value: 'inCharge',
      },{
        text: 'Action',
        value: 'action',
      },],

      FTs: [],

      selectedFTID: undefined,
      isDialogOpen: false,
    }
  },

  async mounted() {
    if(hasRole(this, 'hard')){
      this.FTs = (await this.$axios.$get('/FT')).data;
    } else {
      await this.$router.push({
        path: '/'
      })
    }
  },

  methods:{
    async deleteFT(){
      await this.$axios.$delete('/ft', {
        data: {
          _id : this.selectedFTID,
        },
      });
      this.isDialogOpen = false;
    }
  }
}
</script>

<style scoped>

</style>