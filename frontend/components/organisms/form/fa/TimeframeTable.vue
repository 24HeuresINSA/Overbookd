<template>
  <div>
    <v-card :class="isDisabled ? 'disabled' : ''">
      <v-card-title>Créneaux</v-card-title>
      <v-card-subtitle
        >Pour créer un créneau clique et étire le créneau, une fois créé tu peux
        le déplacer
      </v-card-subtitle>

      <v-data-table :headers="headers" :items="timeframes">
        <template #[`item.action`]="{ index }">
          <v-btn v-if="!isDisabled" icon @click="deleteTimeframe(index)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <!--<TimeframeSelector
        :disabled="isDisabled"
        :store="store"
        @add-timeframe="addTimeframe"
        @set-timeframes="setTimeframes"
      ></TimeframeSelector>-->
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="openAddTimeframe">Ajouter un créneau</v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <v-card class="dialog-card">
        <v-card-title>
          <span class="headline">Ajouter un créneau</span>
        </v-card-title>

        <h3 class="subtitle">Début de l'activité</h3>
        <div class="time-row">
          <v-menu
            v-model="menuDateStart"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="dateStart"
                label="Date de début"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                class="text-date"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateStart"
              :max="dateEnd"
              @input="menuDateStart = false"
            ></v-date-picker>
          </v-menu>

          <v-menu
            ref="menuTimeStart"
            v-model="menuTimeStart"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="timeStart"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="timeStart"
                label="Heure de début"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuTimeStart"
              v-model="timeStart"
              :allowed-minutes="allowedStep"
              format="24hr"
              scrollable
              full-width
              :max="dateStart == dateEnd ? timeEnd : ''"
              @click:minute="$refs.menuTimeStart.save(timeStart)"
            ></v-time-picker>
          </v-menu>
        </div>

        <h3 class="subtitle">Fin de l'activité</h3>
        <div class="time-row">
          <v-menu
            v-model="menuDateEnd"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="dateEnd"
                label="Date de fin"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                class="text-date"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="dateEnd"
              :min="dateStart"
              @input="menuDateEnd = false"
            ></v-date-picker>
          </v-menu>

          <v-menu
            ref="menuTimeEnd"
            v-model="menuTimeEnd"
            :close-on-content-click="false"
            :nudge-right="40"
            :return-value.sync="timeEnd"
            transition="scale-transition"
            offset-y
            max-width="290px"
            min-width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="timeEnd"
                label="Heure de fin"
                prepend-icon="mdi-clock-time-four-outline"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-time-picker
              v-if="menuTimeEnd"
              v-model="timeEnd"
              :allowed-minutes="allowedStep"
              format="24hr"
              scrollable
              full-width
              :min="dateStart == dateEnd ? timeStart : ''"
              @click:minute="$refs.menuTimeEnd.save(timeEnd)"
            ></v-time-picker>
          </v-menu>
        </div>
        <v-card-text>Minuit = 00:00 du jour d'après</v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="isAddDialogOpen = false">
            Annuler
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="isDisabled"
            @click="addTimeframe"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimeframeSelector from "~/components/molecules/timeframe/TimeframeSelector.vue";

export default Vue.extend({
  name: "TimeframeTable",
  components: { TimeframeSelector },
  props: {
    isDisabled: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    date: "",
    headers: [
      { text: "Date de début", value: "start" },
      { text: "Heure de début", value: "timeStart" },
      { text: "Date de fin", value: "end" },
      { text: "Heure de fin", value: "timeEnd" },
      { text: "Action", value: "action" },
    ],
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    mTimeframe: {},

    dateStart: null,
    dateEnd: null,
    timeStart: null,
    timeEnd: null,
    menuDateStart: false,
    menuTimeStart: false,
    menuDateEnd: false,
    menuTimeEnd: false,
  }),
  computed: {
    mFA(): any {
      return this.$accessor.FA.mFA;
    },
    timeframes(): any {
      return this.$accessor.FA.mFA.time_windows;
    },
  },
  methods: {
    allowedStep: (m: number) => m % 15 === 0,
    addTimeframe() {
      const timeframe = {
        start: new Date(this.dateStart + " " + this.timeStart),
        end: new Date(this.dateEnd + " " + this.timeEnd),
      };
      this.$accessor.FA.addTimeWindow(timeframe);
      this.isAddDialogOpen = false;
      console.log(this.mFA.time_windows);
      // clear v-model
      this.dateStart = this.dateEnd = this.timeStart = this.timeEnd = null;
    },
    editTimeframe(timeframe: any, index: number) {
      /*this.isEditDialogOpen = true;
      this.mTimeframe = { ...timeframe };
      this.mIndex = index;*/
    },
    updateTimeframe() {
      /*let start = new Date(this.timeframes[this.mIndex].start);
      let end = new Date(this.timeframes[this.mIndex].end);

      start.setHours(
        this.mTimeframe.start.split(":")[0],
        this.mTimeframe.start.split(":")[1]
      );
      end.setHours(
        this.mTimeframe.end.split(":")[0],
        this.mTimeframe.end.split(":")[1]
      );

      if (start > end) {
        alert("La date de début doit être inférieure à la date de fin");
        return;
      }
      if (start === end) {
        alert("La date de début doit être différente de la date de fin");
        return;
      }
      if (
        (+this.mTimeframe.end.split(":")[1] % 15 !== 0 ||
          +this.mTimeframe.start.split(":")[1] % 15 !== 0) &&
        !(
          this.mTimeframe.end.split(":")[1] === "59" &&
          this.mTimeframe.end.split(":")[0] === "23"
        )
      ) {
        alert("Les minutes doivent être divisible par 15");
        return;
      }

      this.deleteTimeframe(this.mIndex);

      this.isEditDialogOpen = false;*/
    },
    openAddTimeframe() {
      this.isAddDialogOpen = true;
    },
    deleteTimeframe(index: number) {
      this.$accessor.FA.deleteTimeWindow(index);
      console.log(this.mFA.time_windows);
    },
  },
});
</script>

<style scoped>
.disabled {
  border-left: 5px solid green;
}

.dialog-card {
  display: flex;
  flex-direction: column;
}

.dialog-card .time-row {
  display: flex;
  margin: 0 24px;
}

.dialog-card .subtitle {
  margin: 10px 24px 0 24px;
}

.dialog-card .time-row .text-date {
  margin-right: 30px;
}
</style>
