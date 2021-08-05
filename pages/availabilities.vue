<template>
  <div>
    <h2>Mes disponibilités</h2>
    <p> {{detailMessage}}</p>

    <br>
    <h2>Mes point de charisme: {{userCharisma}}/{{maxCharisma}}</h2>
    <v-progress-linear
        height="25"
      :value="(userCharisma / maxCharisma) * 100"
    >
      <template v-slot:default="{ value }">
        <strong>{{ Math.ceil(value) }}%</strong>
      </template>
    </v-progress-linear>

    <template v-for="availability of availabilities">
      <br>
      <h3>{{availability.name}}</h3>
      <p>{{availability.description}}</p>
      <div style="display: flex">
        <v-container v-for="day of availability.days">
              <v-card width="400px">
                <v-card-title>{{(new Date(day.date)).toLocaleString()}}</v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item v-for="frame of day.frames">
                      <v-list-item-content style="display: flex">
                        <h4>{{frame.start}} ➡️ {{frame.end}}</h4>
                        <v-chip v-if="frame.charisma">{{frame.charisma}}</v-chip>
                      </v-list-item-content>
                      <v-switch v-model="frame.isSelected"></v-switch>
                    </v-list-item>
                  </v-list>
                </v-card-text>
                <v-card-actions>
                  <v-btn text @click="toggleAll(day)">selectionner tous</v-btn>
                  <v-btn text v-if="hasRole('hard')" @click="">ajouter un creneau</v-btn>
                </v-card-actions>
              </v-card>
        </v-container>
      </div>
    </template>

    <v-btn fab style="bottom: 40px; position: fixed; right: 100px" @click="save"><v-icon>mdi-content-save</v-icon></v-btn>

    <v-btn
        color="secondary"
        elevation="2"
        fab
        style="bottom: 40px; position: fixed; right: 20px"
        @click="isDialogOpen = true"
    >
      <v-icon>
        mdi-plus-thick
      </v-icon>
    </v-btn>

    <v-snackbar
        v-model="isSnackbarOpen"
        timeout="5000"
    >
      disponibilite mis a jour 🚀

      <template v-slot:action="{ attrs }">
        <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="isSnackbarOpen = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog
      v-model="isDialogOpen"
    >
      <v-card>
        <v-card-title>Ajouter des dispo 🤑</v-card-title>
        <v-card-text>
          <v-text-field label="Titre" v-model="newAvailability.title"></v-text-field>
          <v-text-field label="Desciption" v-model="newAvailability.description"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text><v-icon>mdi-content-save</v-icon></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import {getConfig, getUser, hasRole} from "../common/role";

export default {
  name: "availabilities",

  data(){
    return {
      detailMessage: this.getConfig("availabilities_description"),
      userCharisma: getUser(this).charisma || 0,
      maxCharisma:  this.getConfig("max_charisma"),
      availabilities: [],
      isAllToggled: false,
      isSnackbarOpen: false,
      isDialogOpen:false,
      newAvailability: {
        title: undefined,
        description: undefined
      }
    }
  },

  async mounted() {
    this.availabilities = (await this.$axios.get('/availabilities')).data;
    const mAvailabilities = this.getUser().availabilities;
    if(mAvailabilities){
      // fill in availabilities\
      this.availabilities.forEach(availability => {
        let mAvailability =  mAvailabilities.find(e => e._id === availability._id)
        if(mAvailability){
          this.$set(availability,'days', mAvailability.days);
        }
      })
    }
  },

  methods:{
    hasRole(role){
      return hasRole(this, role)
    },

    getConfig(key){
      return getConfig(this,key)
    },

    toggleAll(day){
      day.frames.forEach(frame => frame.isSelected = this.isAllToggled);
      this.isAllToggled = !this.isAllToggled
    },

    getUser(){
      return getUser(this)
    },

    save(){
      console.log(this.availabilities);
      // save my availabilities
      this.$axios.put('user/' + this.getUser().keycloakID, {availabilities: this.availabilities})
      this.isSnackbarOpen = true;
    },

    getAvailability(day){
      // return this.availabilities.find(avalability )
    }
  }
}
</script>

<style scoped>

</style>