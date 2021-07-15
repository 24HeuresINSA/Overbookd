<template>
  <div>
    <h2 v-if="isNewFA">Create new FA</h2>
    <div style="display: flex">
      <h4>status {{ FA.status ? FA.status : 'draft' }}</h4>
      <v-icon v-for="validator of validators"
              :color="validator.status ? color[validator.status] : 'grey'"
      >
        {{ validator.icon }}
      </v-icon>
    </div>

    <over-form
      :fields="form"
      @form-change="onFormChange"
    >

    </over-form>

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
            #
          </th>
          <th class="text-left">
            Validator
          </th>
          <th class="text-left">
            Author
          </th>
          <th class="text-left">
            Date
          </th>
          <th class="text-left">
            Comment
          </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="comment in FA.comments"
            :key="comment.text"
        >
          <td>{{ comment.action }}</td>
          <td>{{ comment.validator}}</td>
          <td>{{ comment.author}}</td>
          <td>{{ comment.date}}</td>
          <td>{{ comment.text}}</td>

        </tr>
        </tbody>
      </template>
    </v-simple-table>
    <h4 v-else>pas de commentaire pour l'instant il faut se mettre au charbon</h4>
    <div>

      <v-btn
          color="primary"
          class="fab-right"
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
          class="fab-right"
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
          class="fab-right"
          @click="validate()"
          style="left: 10px"
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
          class="fab-right"
          @click="dialogValidator = true"
          style="left: 150px"
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
        persistent
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
          <span class="text-h5">Add new item</span>
        </v-card-title>
        <v-card-text>
          <v-data-table
              :headers="equipmentsHeader"
              :items="availableEquipments"
          >
            <template v-slot:item.quantity="props">
              <v-text-field type="number" v-model="props.item.selected"></v-text-field>
            </template>
          </v-data-table>
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
  </div>


</template>

<script>
import login from "../login";
import OverForm from "../../components/overForm";

export default {
  name: "_faID",
  components: {OverForm},

  data() {
    return {
      faID: this.$route.params.faID,
      isNewFA: this.$route.params.faID === 'newFA',
      FA: {},
      dialog: false,
      dialogValidator: false,
      dialogModifySelectedItem: false,
      refuseComment: '',
      dialogText: "Are you sure you want to submit this FA. les zumains seront pas content si c'est de la merde 🧂", // TODO should be fetched from API
      validators: [],
      color: {
        'submitted': 'grey',
        'validated': 'green',
        'refused': 'red'
      },
      form: [],
      availableEquipments: [],
      selectedEquipments: [],
      equipmentsHeader : [{
        text: 'name',
        value: 'name',
      },{
        text: 'image',
        value: 'img',
      },{
        text: 'amount',
        value: 'amount',
      },{ text: 'Quantity', value: 'quantity' },]

    }
  },
  async mounted() {
    // getFormConfig
    this.form = this.getConfig('fa_form')

    if (!this.isNewFA) {
      this.fetchFAbyID();
    } else {

    }
  },
  methods: {
    fetchFAbyID() {
      // TODO fetch FA's details from api

    },

    updateValidators(validations){
    },

    saveFA() {
      // save the FA in the DB

      this.$router.push({
        path: '/fa'
      })

    },

    submitForReview() {
      // change status to submitted for review and save in DB
      this.FA.status = 'submitted'
      this.dialog = false;
      this.saveFA();
    },

    validate(tag) {
      // validate FA by the tag and save
      // TODO validate
      this.dialog = false;
      this.saveFA();
    },

    refuse() {
      // refuse FA
    },

    saveItems(){
      this.selectedEquipments = this.availableEquipments.filter(equipment => equipment.selected);
      this.dialogModifySelectedItem = false;
    },

    onFormChange(form){
      console.log(form)
    },

    getConfig(key){
      return this.$store.state.config.data.data.find(e => e.key === key).value
    },
  }
}
</script>

<style scoped>
.fab-right {
  position: absolute;
  right: 10px;
  bottom: 10px;
  color: white;
}
</style>