<template>
<v-container>
  <h1>La Log 🚚 (work in progess 🔨)</h1>

  <v-select label="item a verifier" v-model="selectedItem" :items="equipments.map(e => e.name)"></v-select>

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
      equipments : [],
      selectedItem: undefined,
    }
  },

  async mounted() {
    if(hasRole(this, 'log')){
      const {data: {data : FTs }} = await this.$axios.get('/ft');
      FTs.forEach(FT => {
        FT.equipments.forEach(FTequipment => {
          let existingEquipment =  this.equipments.find(equipment => equipment.name === FTequipment.name);
          if(existingEquipment){
            existingEquipment.requested.push(FT.schedules.map(({date, start, end})=> {
              return {
                date, start, end,
                amount: FTequipment.selectedAmount,
                FT: {
                  id: FT._id,
                  name: FT.name
                },
              }
            }))
          } else {
            this.equipments.push({
              name: FTequipment.name,
              requested: FT.schedules.map(({date, start, end})=> {
                return {
                  date, start, end,
                  amount: FTequipment.selectedAmount,
                  FT: {
                    id: FT._id,
                    name: FT.name
                  },
                }
              })
            })
          }
        })
      })

      console.log(this.equipments)

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