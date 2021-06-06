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

    <h2>Matos 🚚</h2>

    <v-container>
      <v-data-iterator
          :items="equipments"
          item-key="name"
          :items-per-page="4"
          hide-default-footer
      >
        <template v-slot:default="{ items, isExpanded, expand }">
          <v-row>
            <v-col
                v-for="item in items"
                :key="item.name"
                cols="12"
                sm="6"
                md="4"
                lg="3"
            >
              <v-card>
                <v-img
                    height="250"
                    :src="item.img ? `https://firebasestorage.googleapis.com/v0/b/poc-overbookd.appspot.com/o/log%2F${item.img}?alt=media&token=30d6b298-a132-44a7-a23b-f55ff913ce56` : ''"
                ></v-img>
                <v-card-title>
                  <h4>{{ item.name }}</h4>
                </v-card-title>
                <v-text-field></v-text-field>
                <v-divider></v-divider>
                <v-list
                    dense
                >
                  <v-list-item>
                    <v-list-item-content>Available:</v-list-item-content>
                    <v-list-item-content class="align-end">
                      {{ item.amount }}
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>


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
      refuseComment: '',
      dialogText: "Are you sure you want to submit this FA. les zumains seront pas content si c'est de la merde 🧂", // TODO should be fetched from API
      eventDoc: this.$fire.firestore.collection('24heures').doc('46'),
      validators: [],
      color: {
        'submitted': 'grey',
        'validated': 'green',
        'refused': 'red'
      },
      form: [],
      equipments: [],
    }
  },
  async mounted() {
    // this.eventDoc.set({
    //   FA_form : this.form,
    // })
    // init
    this.eventDoc.collection('equipments').onSnapshot(equipments => {
      this.equipments = [];
      equipments.forEach(equipment => {
        this.equipments.push(equipment.data())
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
      console.log(mFA);

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