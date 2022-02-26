<template>
  <div>
    <v-simple-table dense  ref="simpleTable">
      <template v-slot:default>
        <thead>
          <tr>
            <th>

            </th>
            <th class="text-left">
              Vendredi 20 mai
            </th>
            <th class="text-left">
              Samedi 21 mai
            </th>
            <th>
              Dimanche 22 mai
            </th>
          </tr>
        </thead>
        <tbody>
          <tr 
          v-for="h,i in hourColumn"
          :key="i"
          >
            <td>
              {{ h }}
            </td>
            <td @click="execute(i, 0)">
              {{ userDisponibilityTable[0][i] || 0 }}
            </td>
            <td @click="execute(i, 1)">
              {{ userDisponibilityTable[1][i] || 0 }}
            </td>
            <td @click="execute(i, 2)">
              {{ userDisponibilityTable[2][i] || 0 }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

//288 cells in totals (3 * 96)
//Declare type array of array of size 3 * 96

export default Vue.extend({
  data() {
    return {
      firstCaseDate: new Date(2022, 4, 20, 0, 0, 0, 0),
      userDisponibilityTable: [[], [], []] as number[][],
    }
  },
  computed: {
    hourColumn(): String[] {
      const hourColumn: String[] = []
      const startDate = new Date(2022, 5, 20, 0, 0, 0, 0)
      const startDate15 = new Date(2022, 5, 20, 0, 15, 0, 0)
      //push stardate in array and stardate + 15 minutes in array
      //subdivision of 15 minutes (4 times in a hour, 24 times a day)
      for (let i = 0; i < 24*4; i++) {
        hourColumn.push(`${startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} --> ${startDate15.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`)
        startDate.setMinutes(startDate.getMinutes() + 15)
        startDate15.setMinutes(startDate15.getMinutes() + 15)
      }
      return hourColumn;
    }
  },
  async beforeMount(){
    await this.initStore();
    this.getCellNumberOfDisponibilities();
    await Vue.nextTick();
  },
  async mounted(){
  },
  methods: {
    async initStore(){
      await this.$accessor.user.fetchUser();
      await this.$accessor.timeslot.fetchUserNumberByDate();
    },
    //calculate date from row and column index with 0,0 being firstCaseDate, i an increment of 15 minutes, j an increment of 1 day
    dateByTableIndex(i: number, j: number, firstCaseDate: Date){
      const date = new Date(firstCaseDate);
      date.setMinutes(date.getMinutes() + (i*15));
      date.setDate(date.getDate() + j);
      return date;
    },
    //calculate row and column index from date, with 0;0 being firstCaseDate, i an increment of 15 minutes, j an increment of 1 day
    tableIndexByDate(date: Date, firstCaseDate: Date): {i: number, j: number} {
      const i = Math.floor((date.getTime() - firstCaseDate.getTime()) / (15 * 60 * 1000)) % 96;
      const j = Math.floor((date.getTime() - firstCaseDate.getTime()) / (24 * 60 * 60 * 1000));
      return {i, j};
    },
    execute(i: number, j: number){
      const caldDate = this.dateByTableIndex(i, j, this.firstCaseDate);
      console.log(`${i},${j} ; ${caldDate}`);
      console.log(`${this.tableIndexByDate(caldDate, this.firstCaseDate).i},${this.tableIndexByDate(caldDate, this.firstCaseDate).j}`);
    },
    getCellNumberOfDisponibilities(){
      //DISCLAIMER: 
      // Tout est sur la base de créneaux de 2h, la logique serait complétement différente dans un autre cas
      const userNumberbyDate = this.$accessor.timeslot.userNumberByDate;
      userNumberbyDate.forEach((value, key) => {
        const date = new Date();
        date.setTime(key);
        const tableIndex = this.tableIndexByDate(date, this.firstCaseDate);
        //On est en coupe de 15min, donc on update la cellule courant, et les 7 d'après
        if(tableIndex.i >= 0 && tableIndex.j >= 0){
          for(let i = 0; i < 8; i++){
            Vue.set(this.userDisponibilityTable[tableIndex.j], tableIndex.i + i, value);
          }
          //this.userDisponibilityTable[tableIndex.j][tableIndex.i] = value;
          console.log(this.userDisponibilityTable[tableIndex.j][tableIndex.i], tableIndex.i, tableIndex.j)
        }
      });
    },
    
  },

});
</script>

<style>

</style>