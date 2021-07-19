<template>
  <div>
    <h1>Fiche Tache 🤩</h1>
    <over-form
        v-if="FT_FORM"
      :fields="FT_FORM"
      @form-change="onFormChange"
    ></over-form>
    
    <br>
    <v-divider></v-divider>
    <h2>Horaires ⏱</h2>
    <v-simple-table v-if="FT.schedules">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left">
            jour
          </th>
          <th>debut</th>
          <th class="text-left">
            fin
          </th>
          <th class="text-left">
            action
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="schedule in FT.schedules"
            :key="schedule.day + schedule.start + schedule.end"
        >
          <td>{{schedule.date}}</td>
          <td>{{schedule.start}}</td>
          <td>{{schedule.end}}</td>
          <td><v-btn @click="deleteSchedule(schedule)">🗑</v-btn></td>

        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-container style="display: flex; justify-content: space-around; align-content: baseline">
      <v-date-picker v-model="schedule.date"></v-date-picker>
      <h3>Debut</h3>
      <v-time-picker format="24h" v-model="schedule.start"></v-time-picker>
      <h3>Fin</h3>
      <v-time-picker format="24h" v-model="schedule.end"></v-time-picker>
      <v-btn
          fab
          style="margin: 20px;"
          @click="addSchedule"
      >
        <v-icon>
          mdi-plus-thick
        </v-icon>
      </v-btn>

    </v-container>

    <br>
    <v-divider></v-divider>
    <h2>Matériellllllll 🚎 🚐 🚅 ✈️ </h2>
    <v-data-table
      :headers="equipmentsHeader"
      :items="selectedEquipment"
    ></v-data-table>
    <v-btn fab @click="isEquipmentDialogOpen = true"><v-icon>mdi-plus</v-icon></v-btn>

    <v-dialog v-model="isEquipmentDialogOpen">
      <v-card>
        <v-card-title>ajouter du matos</v-card-title>
        <v-card-text>
          <v-data-table
              :headers="equipmentsHeader"
              :items="availableEquipment"
          >
            <template v-slot:item.selectedAmount="item">
              <v-text-field type="number" v-model="item.item.selectedAmount"></v-text-field>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="saveEquipments">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div style="display: flex; justify-content: space-evenly">
      <v-btn color="green" @click="saveFT">validate</v-btn>
      <v-btn color="red" @click="saveFT">refuse</v-btn>
      <v-btn color="secondary" @click="saveFT">submit</v-btn>
      <v-btn color="warning" @click="saveFT">save 💾</v-btn>
    </div>
  </div>
</template>

<script>
import OverForm from "../../components/overForm";
export default {
  name: "_ft",
  components: {OverForm},
  data() {
    return {
      FTID: this.$route.params.ft,
      FT: {},
      FT_FORM: this.getConfig('ft_form'),
      schedules: [],
      schedule: {
        date: undefined,
        start: undefined,
        end: undefined
      },

      isEquipmentDialogOpen: false,
      equipmentsHeader: [
          {text: 'item', value: 'name'},
          {text: 'selectionné', value: 'selectedAmount'},
      ],

      selectedEquipment: [],
      availableEquipment: [],
    }
  },

  async mounted() {
    let mFT = (await this.$axios.get('/ft/' + this.FTID)).data;
    Object.keys(mFT).forEach(key => {
      let field = this.FT_FORM.find(field => field.key === key);
      if(field){
        this.$set(field, 'value', mFT[key])
        console.log(field)
      }
    })
    this.schedules = mFT.schedules || [];
    this.availableEquipment = (await this.$axios.get('/equipment')).data;
    // this.availableEquipment.filter(equipment => equipment.type === '') // TODO
  },

  methods: {
    onFormChange(form){
      this.FT = form
    },

    getConfig(key){
      return this.$store.state.config.data.data.find(e => e.key === key).value
    },

    addSchedule(){
      if(!this.FT.schedules){
        this.$set(this.FT, 'schedules' , [])
      }
      this.$set(this.FT.schedules,this.FT.schedules.length , {...this.schedule})
    },

    saveEquipments(){
      this.selectedEquipment = [];
      this.availableEquipment.forEach(e => {
        if(e.selectedAmount !== undefined){
          this.selectedEquipment.push(e);
        }
      })
      this.isEquipmentDialogOpen = false;
    }
  }
}
</script>

<style scoped>

</style>