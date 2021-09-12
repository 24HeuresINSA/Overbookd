<template>
  <div>
    <v-container style="display: flex; align-content: center;justify-content: space-between;">
    <h1>Fiche Tache 🤩</h1>
    <h2>Status {{FT.status || 'draft'}}</h2>
    </v-container>
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
            #
          </th>
          <th class="text-left">
            type
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
          <td>{{schedule.amount}}</td>
          <td>{{schedule.type}}</td>
          <td><v-btn @click="deleteSchedule(schedule)">🗑</v-btn></td>

        </tr>
        </tbody>
      </template>
    </v-simple-table>

    <v-container style="display: grid;">
      <v-row>
        <v-col>
          <h3>Date</h3>
        </v-col>
        <v-col>
          <h3>Debut</h3>
        </v-col>
        <v-col>
          <h3>Fin</h3>
        </v-col>
        <v-col>
          <h3>Membre requit</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-date-picker v-model="schedule.date" first-day-of-week="1"></v-date-picker>
        </v-col>
        <v-col>
          <v-time-picker :allowed-minutes="allowedMinutes" format="24h" v-model="schedule.start"></v-time-picker>
        </v-col>
        <v-col>
          <v-time-picker :allowed-minutes="allowedMinutes" format="24h" v-model="schedule.end"></v-time-picker>
        </v-col>
        <v-col style="align-items: center">
          <v-select
              v-model="schedule.type"
              label="team"
              :items="getConfig('teams').map(e => e.name)"
          ></v-select>
          <v-text-field
              type="number"
              label="nombre"
              v-model="schedule.amount"
          ></v-text-field>
          <v-btn
              fab
              @click="addSchedule"
          >
            <v-icon>
              mdi-plus-thick
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
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

    <v-dialog v-model="isRefusedDialogOpen">
      <v-card>
        <v-card-title>Refuser la FT</v-card-title>
        <v-card-text>
          <v-textarea v-model="refusedComment"></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="refuse">refuse</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isSubmitDialogOpen" width="600px">
      <v-card>
        <v-img src="img/memes/submit_FT.gif" height="300px"></v-img>
        <v-card-title>t'es sur de ta FT ? </v-card-title>
        <v-card-actions>
          <v-btn text @click="isSubmitDialogOpen=false">Non</v-btn>
          <v-btn text @click="submitForReview">je suis sûr</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="isSnackbarOpen" :timeout="5000">{{snackbarMessage}}</v-snackbar>

    <div style="display: flex; justify-content: space-evenly">
      <v-btn color="green" v-if="getValidator()"  @click="validateFT">validate</v-btn>
      <v-btn color="red" v-if="getValidator()" @click="isRefusedDialogOpen = true">refuse</v-btn>
      <v-btn color="secondary" @click="isSubmitDialogOpen = true">submit</v-btn>
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
      FT_VALIDATORS: this.getConfig('ft_validators'),
      schedules: [],
      refusedComment: undefined,
      isRefusedDialogOpen: false,
      isSubmitDialogOpen: false,
      isSnackbarOpen: false,
      snackbarMessage: "",
      feedbacks:{
        validate: 'FT valide ',
        refused: 'FT refuse  🥺',
        save: 'FT sauvgarde',
        submitted: 'FT soumise a validation 🥵 may the odds be with you' ,
      },
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
    this.FT = mFT;
    console.log(mFT);
    Object.keys(mFT).forEach(key => {
      let field = this.FT_FORM.find(field => field.key === key);
      if(field){
        this.$set(field, 'value', mFT[key])
      }
    })
    this.$set(this, 'schedules', mFT.schedules || [])
    this.availableEquipment = (await this.$axios.get('/equipment')).data;
    if (mFT.equipments){
      this.selectedEquipment = mFT.equipments;
    }
    // this.availableEquipment.filter(equipment => equipment.type === '') // TODO
  },

  methods: {
    onFormChange(form){
      this.FT = form
    },

    allowedMinutes: m => m % 15 === 0,

    getConfig(key){
      return this.$store.state.config.data.data.find(e => e.key === key).value
    },

    getUser(){
      return this.$store.state.user.data
    },

    hasRole(role){
      const teams = this.getUser()?.team;
      if (teams === undefined){
        return false
      }
      return teams.includes(role);
    },

    getValidator(){
      let mValidator = null;
      this.FT_VALIDATORS.forEach(validator => {
        if (this.hasRole(validator.name)){
          mValidator = validator.name
        }
      })
      return mValidator
    },

    deleteSchedule(schedule){
      this.FT.schedules = this.FT.schedules.filter(s => {
        return s.date !== schedule.date && s.end !== schedule.end && s.start !== schedule.start
      })
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
      this.FT.equipments = this.selectedEquipment;
      this.isEquipmentDialogOpen = false;
    },

    saveFT(){
      this.FT._id = this.FTID;
      this.$axios.put('/ft', this.FT);
    },

    validateFT(){
      const validator = this.getValidator();
      if(this.FT.validated === undefined){
        this.FT.validated = [];
      }
      if(this.FT.refused){
        this.FT.refused = this.FA.refused.filter(e => e !== validator);
      }
      this.FT.validated.push(validator)

      if(this.FT.validated.length === this.FT_VALIDATORS.length){
        this.FT.status = 'validated'
      }
      this.snackbarMessage = this.feedbacks.validate;
      this.isSnackbarOpen = true;
      this.saveFT();
    },

    submitForReview(){
      this.FT.status = 'submitted';
      this.snackbarMessage = this.feedbacks.submitted;
      this.isSnackbarOpen = true;
      this.isSubmitDialogOpen = false;
      this.saveFT();
    },

    refuse(){
      this.FT.status = 'refused';
      const validator = this.getValidator();
      if(this.FT.refused === undefined){
        this.FT.refused = [];
      }
      this.FT.refused.push(validator);
      this.snackbarMessage = this.feedbacks.refused;
      this.isSnackbarOpen = true;
      this.isRefusedDialogOpen = false;
      this.saveFT()
    }
  }
}
</script>

<style scoped>

</style>