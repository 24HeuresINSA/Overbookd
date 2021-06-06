<template>
  <div>
    <h2 v-if="isNewFA">Create new FA</h2>
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
          <p v-if="field.description">{{field.description}}</p>

        </v-row>
      </v-container>
    </v-form>
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
  </div>


</template>

<script>
export default {
  name: "_faID",
  data() {
    return {
      faID: this.$route.params.faID,
      isNewFA: this.$route.params.faID === 'newFA',
      FA: {},
      dialog: false,
      dialogValidator: false,
      refuseComment: '',
      dialogText: "Are you sure you want to submit this FA. les zumains seront pas content si c'est de la merde 🧂", // TODO should be fetched from API
      form: [{
        key: 'name',
        type: 'string',
      }, {
        key: 'description',
        type: 'string',
      }, {
        key: 'startDate',
        name: 'start date',
        type: 'datetime',
      }, {
        key: 'endDate',
        name: 'end date',
        type: 'datetime',
      }, {
        key: 'location',
        name: 'location',
        type: 'string',
      }, {
        key: 'type',
        name: 'type',
        type: 'select',
        options: ['Com', 'Divertissement']
      }, {
        key: 'pass',
        name: 'Besoin de pass secu ? ',
        type: 'switch',
      },
        {
          key: 'isElectricityNeed',
          name: "Besoin d'electricite ?",
          type: 'switch',
        },
        {
          key: 'isSignalisationNeeded',
          name: "Besoin de signalique ?",
          type: 'switch',
        }, {
          key: 'signalisationNeedDescription',
          name: "Desctiption du dispositif",
          type: 'string',
        },
      ]
    }
  },
  mounted() {
    // this.$fire.firestore.collection('24heures').doc('46').set({
    //   FA_form : this.form,
    // })

    if (!this.isNewFA) {
      this.fetchFAbyID();
    } else {

    }
  },
  methods: {
    fetchFAbyID() {
      // TODO fetch FA's details from api
      console.log(this.faID)
      this.FA = this.$fire.firestore.collection('24heures').doc('46').collection('FA').doc(this.faID).onSnapshot((FA) => {
        const FAdata = FA.data();
        const tmp = this.form;
        for (let key of Object.keys(FAdata)) {
          let field = tmp.find(e => e.key === key)
          if (field) {
            if (field.type !== 'datetime') {
              field.value = FAdata[key];
              console.log('set: ', field.value)
            }
          }

        }
        this.form = tmp;
        console.log(this.form)
      })
    },

    saveFA() {
      // save the FA in the DB
      console.log(this.form)
      let mFA = {};
      this.form.forEach(field => {
        mFA[field.key] = field.value;
        if(field.type ==='datetime'){
          console.log(field)
          mFA[field.key] = new Date(field.date);
          if(field.time){
            const mTime = field.time.split(':');
            console.log(mTime)
            mFA[field.key].setHours(+mTime[0], +mTime[1])
          }
        }
      })
      console.log(mFA);

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