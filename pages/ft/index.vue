<template>
  <div>
    <h1>Fiche Tache 👻</h1>
    <v-data-table
      :headers="headers"
      :items="FTs"
    >
      <template v-slot:item.action="row">
        <nuxt-link :to="'/ft/' + row.item._id">
          <v-btn
              style="margin: 5px"
              fab

          ><v-icon>mdi-text-search</v-icon></v-btn>
        </nuxt-link>

      </template>
    </v-data-table>
  </div>
</template>

<script>
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
    }
  },

  async mounted() {
    // TODO role check

    // get FTs
    this.FTs = (await this.$axios.$get('/FT')).data;
    console.log(this.FTs)
  }
}
</script>

<style scoped>

</style>