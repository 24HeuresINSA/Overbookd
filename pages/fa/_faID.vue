<template>
  <div>
    <h2 v-if="isNewFA">Create new FA</h2>
    <v-form>
      <v-container>
      <v-row v-for="field in form">
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
          @click="refuse()"
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
  </div>


</template>

<script>
export default {
  name: "_faID",
  data() {
    return {
      faID : this.$route.params.faID,
      isNewFA: this.$route.params.faID === 'newFA',
      FA: {},
      dialog: false,
      dialogText : "Are you sure you want to submit this FA. les zumains seront pas content si c'est de la merde 🧂", // TODO should be fetched from API
      form : [{
        key: 'name',
        type: 'string',
      },{
        key: 'description',
        type: 'string',
      },{
        key: 'startDate',
        name: 'start date',
        type: 'datetime',
      },{
        key: 'endDate',
        name: 'end date',
        type: 'datetime',
      },]
    }
  },
  mounted() {
    if(!this.isNewFA){
      this.fetchFAbyID();
    } else {

    }
  },
  methods:{
    fetchFAbyID(){
      // TODO fetch FA's details from api
      this.FA = {
        "name": "Ramener le fromage à la maison",
        "description": "on a acheté bcp bcp (bcp) de fromage et on doit le stocker dans le frigos",
        "startDate": "2019/05/11 12:00:00",
        "endDate": "2019/05/11 18:00:00",
        "eventId": 1,
        "supervisorId": 2
      }
    },

    saveFA(){
      // save the FA in the DB
    },

    submitForReview(){
      // change status to submitted for review and save in DB
      this.FA.status = 'submitted'
      this.dialog = false;
      this.saveFA();
    },

    validate(tag){
      // validate FA by the tag and save
      // TODO validate
      this.dialog = false;
      this.saveFA();
    },

    refuse(){
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