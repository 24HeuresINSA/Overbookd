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
    <v-form>
      <v-container>
        <v-row v-for="field in form" v-bind:key="field.key">
          <v-col
              cols="12"
              md="4"
          ></v-col>
          <v-text-field
              v-model="field.value"
              v-if="field.type=== 'string'"
              :rules="field.rule"
              :counter="field.counter"
              :label="field.name ? field.name : field.key"
              required
          ></v-text-field>
          <v-switch
              v-model="field.value"
              :label="field.name ? field.name : field.key"
              v-else-if="field.type === 'switch'"
          ></v-switch>
          <v-select
              v-else-if="field.type === 'select'"
              :label="field.name ? field.name : field.key"
              v-model="field.value"
              :items="field.options"
          ></v-select>
          <v-date-picker
              v-if="field.type.includes('date')"
              :label="field.name ? field.name : field.key"
              v-model="field.date"
          ></v-date-picker>
          <v-time-picker
              v-if="field.type.includes('time')"
              :label="field.name ? field.name : field.key"
              v-model="field.time"
          ></v-time-picker>
          <p v-if="field.description">{{ field.description }}</p>

        </v-row>
      </v-container>
    </v-form>
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

export default {
  name: "_faID",
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
    // this.eventDoc.set({
    //   FA_form : this.form,
    // })
    // init
    this.eventDoc.collection('equipments').onSnapshot(equipments => {
      this.availableEquipments = [];
      equipments.forEach(equipment => {
        this.availableEquipments.push(equipment.data())
      })
    })

    const mEvent = (await this.eventDoc.get()).data();
    if(mEvent){
      this.validators = mEvent.validators;
      this.form = mEvent.FA_form;
    }

    if (!this.isNewFA) {
      this.fetchFAbyID();
    } else {

    }
  },
  methods: {
    fetchFAbyID() {
      // TODO fetch FA's details from api
      console.log(this.faID)
      this.FA = this.eventDoc.collection('FA').doc(this.faID).onSnapshot((FA) => {
        const FAdata = FA.data();
        this.FA = FAdata;
        const tmp = this.form;
        for (let key of Object.keys(FAdata)) {
          let field = tmp.find(e => e.key === key)
          if (field) {
            if (field.type !== 'datetime') {
              field.value = FAdata[key];
              console.log('set: ', field.value)
            } else {
              console.log(field)
            }
          }

        }
        this.form = tmp;
        // update validators
        this.updateValidators(FAdata.validations);
        console.log(this.validators)
      })
    },

    updateValidators(validations){
      console.log(validations)
      this.validators.forEach(validator => {
        validator.status = validations[validator.name];
      })
      console.log(this.validators)
    },

    saveFA() {
      // save the FA in the DB
      console.log(this.form)
      let mFA = {};
      this.form.forEach(field => {
        mFA[field.key] = field.value ? field.value : null;
        if (field.type === 'datetime') {
          console.log(field)
          mFA[field.key] = new Date(field.date);
          if (field.time) {
            const mTime = field.time.split(':');
            console.log(mTime)
            mFA[field.key].setHours(+mTime[0], +mTime[1])
          }
        }
      })
      mFA.equipments = this.selectedEquipments;
      console.log(mFA);
      // update validation status


      this.eventDoc.collection('FA').doc(mFA.name).set(mFA);
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
    }
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