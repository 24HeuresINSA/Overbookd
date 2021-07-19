<template>
  <div>
    <h2 v-if="isNewFA">Create new FA</h2>
    <div style="display: flex">
      <h3>status {{ FA.status ? FA.status : 'draft' }}</h3>
      <v-icon v-for="validator of validators"
              :color="validator.status ? color[validator.status] : 'grey'"
      >
        {{ validator.icon }}
      </v-icon>
    </div>
    <br>


    <over-form
      :fields="form"
      @form-change="onFormChange"
    >
    </over-form>

    <v-divider></v-divider>
    <h2>Horaires ⏱</h2>
    <v-simple-table v-if="FA.schedules">
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
            v-for="schedule in FA.schedules"
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



    <v-divider></v-divider>
    <h2>Matos 🚚</h2>
    <v-data-table
      :headers="equipmentsHeader"
      :items="selectedEquipments"
    >
      <template v-slot:top>
        <v-toolbar
            flat
        >
          <v-toolbar-title>Equipments</v-toolbar-title>
          <v-divider
              class="mx-4"
              inset
              vertical

          ></v-divider>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="dialogModifySelectedItem=true"
          >
            Add new equipment
          </v-btn>
        </v-toolbar>
      </template>
    </v-data-table>


    <v-divider></v-divider>
    <h2>Comments</h2>
    <v-simple-table v-if="FA.comments">
      <template v-slot:default>
        <thead>
        <tr>
          <th class="text-left">
            validateur
          </th>
          <th>autheur</th>
          <th class="text-left">
            commentaire
          </th>
          <th class="text-left">
            Date
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="comment in FA.comments"
            :key="comment.time"
        >
          <td><v-icon :color="color[comment.action]">{{ getIcon(comment) }}</v-icon></td>
          <td>{{ comment.by}}</td>
          <td>{{ comment.comment}}</td>
          <td>{{(new Date(comment.time)).toLocaleString()}}</td>

        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <h4 v-else>pas de commentaire pour l'instant il faut se mettre au charbon</h4>

    <br>
    <v-divider></v-divider>
    <h2>Fiche tâche  🤩</h2>
    <v-data-table
      :headers="FTHeader"
      :items="FA.FTs"
    >
      <template v-slot:item.action = item>
        <v-btn :href="'/ft/' + item.item._id"><v-icon>mdi-link</v-icon></v-btn>
      </template>
    </v-data-table>
    <v-text-field v-model="FTname"></v-text-field>
    <v-btn @click="addFT">ajouter une FT</v-btn>

    <div style="height: 100px"></div>

    <div>
      <v-btn
          color="primary"
          class="fab"
          @click="saveFA"
      >
        <v-icon
            left
        >
          mdi-content-save
        </v-icon>
        Save
      </v-btn>
      <v-btn
          color="green"
          class="fab"
          @click="dialog=true"
          style="right: 120px"
      >
        <v-icon
            left
        >
          mdi-clipboard-check
        </v-icon>
        Submit for review
      </v-btn>

      <v-btn
          color="green"
          class="fab"
          @click="validate()"
          style="left: 10px"
          v-if="getValidator()"
      >
        <v-icon
            left
        >
          mdi-check
        </v-icon>
        validate
      </v-btn>

      <v-btn
          color="red"
          class="fab"
          @click="dialogValidator = true"
          style="left: 150px"
          v-if="getValidator()"
      >
        <v-icon
            left
        >
          mdi-cancel
        </v-icon>
        refuse
      </v-btn>
    </div>

    <v-dialog
        v-model="dialog"
        width="500"
    >
      <v-card>
        <v-img
            height="620"
            src="https://media.discordapp.net/attachments/726537148119122023/806793684598128640/WhatsApp_Image_2021-02-03_at_23.36.35.jpeg"
        ></v-img>

        <v-card-title class="text-h5 grey lighten-2">
          ⚠️ Warning ⚠️
        </v-card-title>

        <v-card-text>
          {{ dialogText }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="submitForReview"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="dialogValidator"
        max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Refuse FA</span>
        </v-card-title>
        <v-card-text>
          <h4>pourquoi c'est de la 💩</h4>
          <p>sans trop de 🧂</p>
          <v-text-field
              required
              v-model="refuseComment"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="refuse"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
        v-model="dialogModifySelectedItem"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">Ajouter un nouveau item</span>
        </v-card-title>
        <v-card-text>
          <v-data-table
              :headers="equipmentsHeader"
              :items="availableEquipments"
          >
            <template v-slot:item.selected="props">
              <v-text-field type="number" v-model="props.item.selected"></v-text-field>
            </template>
          </v-data-table>
          <v-text-field v-model="requestedEquipment" label="Demander un material non present sur la liste<"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              @click="saveItems"
          >
            save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
        v-model="isSnackbar"
        :timeout="5000"
    >
      {{ snackbarMessage }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="blue"
            text
            v-bind="attrs"
            @click="isSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>


</template>

<script>
import OverForm from "../../components/overForm";

export default {
  name: "_faID",
  components: {OverForm},

  data() {
    return {
      faName: this.$route.params.faID,
      isNewFA: this.$route.params.faID === 'newFA',
      FA: {},
      dialog: false,
      dialogValidator: false,
      dialogModifySelectedItem: false,
      requestedEquipment: undefined,
      refuseComment: '',
      isSnackbar : false,
      snackbarMessage: 'la FA a bien ete sauvgarder 😅',
      dialogText: this.getConfig("fb_confirm_submit"),
      validators: this.getConfig("fa_validators"),
      FTname: undefined,
      schedule: {
        date: undefined,
        start: undefined,
        end: undefined
      },
      color: {
        'submitted': 'grey',
        'validated': 'green',
        'refused': 'red'
      },
      form: [], // FA form settings
      availableEquipments: [],
      selectedEquipments: [],
      equipmentsHeader : [{
        text: 'name',
        value: 'name',
      },{
        text: 'disponible',
        value: 'amount',
      },{
        text: 'sélectionner',
        value: 'selected'
      },],
      FTHeader: [
        {text: 'nom', value: 'name'},
        {text: 'action', value: 'action'},
      ]

    }
  },
  async mounted() {
    console.log(this.validators)
    // getFormConfig
    this.form = this.getConfig('fa_form')
    this.availableEquipments = await this.$axios.$get('/equipment');

    if (!this.isNewFA) {
      this.FA = (await this.fetchFAbyName(this.faName)).data;
      // update the form that is going to be displayed
      Object.keys(this.FA).forEach(key => {
        let mField = this.form.find(field => field.key === key);
        if(mField){
          this.$set(mField, 'value', this.FA[key]);
          mField.value = this.FA[key];
        }
      })

      // update validator status
      if (this.FA.refused){
        this.FA.refused.forEach(v => {
          let refuse = this.validators.find(e => e.name === v);
          console.log(refuse)
          this.$set(refuse, 'status', 'refused')
        })
      }

      if (this.FA.validated){
        this.FA.validated.forEach(v => {
          let refuse = this.validators.find(e => e.name === v);
          console.log(refuse)
          this.$set(refuse, 'status', 'validated')
        })
      }
      
    } else {

    }
  },
  methods: {
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

    async fetchFAbyName(name) {
      return this.$axios.get('fa/' + name);
    },

    getIcon(comment){
      let mValidator = this.validators.find(v => v.name === comment.by)
      if(mValidator){
       return  mValidator.icon
      }
      return
    },

    updateValidators(validations){
    },

    async saveFA() {
      // save the FA in the DB
      await this.$axios.put('/fa', this.FA);
      this.isSnackbar = true;
      // this.$router.push({
      //   path: '/fa'
      // })

    },

    getValidator(){
      let mValidator = null;
      this.validators.forEach(validator => {
        if (this.hasRole(validator.name)){
          mValidator = validator.name
        }
      })
      return mValidator
    },

    submitForReview() {
      // change status to submitted for review and save in DB
      this.FA.status = 'submitted'
      this.dialog = false;
      this.saveFA();
    },

    validate() {
      const validator = this.getValidator();
      if(this.FA.validated === undefined){
        this.FA.validated = []
      }
      if(this.FA.refused){
        this.FA.refused = this.FA.refused.filter(e => e !== validator);
      }
      this.addComment('validated')

      this.FA.validated.push(validator)
      this.addComment('accepted')
      this.dialog = false;
      this.saveFA();
    },

    refuse() {
      // refuse FA
      const validator = this.getValidator();
      if(this.FA.refused === undefined){
        this.FA.refused = [];
      }
      this.addComment('refused', this.refuseComment)
      this.FA.refused.push(validator);
      this.FA.status = 'refused'
      this.dialogValidator = false;
      this.saveFA();
    },

    addComment(action, comment){
      if (!this.FA.comments){
        this.FA.comments = [];
      }
      this.FA.comments.push(
          {
            time : new Date(),
            action,
            comment,
            by: this.getUser().nickname ? this.getUser().nickname : this.getUser().lastname,
            validator: this.getValidator(),
          });

    },

    addSchedule(){
      if(!this.FA.schedules){
        this.$set(this.FA, 'schedules' , [])
      }
      this.$set(this.FA.schedules,this.FA.schedules.length , {...this.schedule})
    },

    saveItems(){
      this.selectedEquipments = this.availableEquipments.filter(equipment => equipment.selected);
      this.dialogModifySelectedItem = false;
    },

    onFormChange(form){
      this.FA = form
    },

    getConfig(key){
      return this.$store.state.config.data.data.find(e => e.key === key).value
    },

    async addFT(){
      if(!this.FA.FTs){
        this.FA.FTs = [];
      }
      const FT = (await this.$axios.post('/FT', {name: this.FTname})).data
      this.FA.FTs.push(FT._id);
      await this.saveFA();
      this.$router.push({
        path: '/ft/' + FT._id,
      })
    }
  }
}
</script>

<style scoped>
.fab {
  position: fixed;
  z-index: 5;
  right: 10px;
  bottom: 10px;
  color: white;
}
</style>