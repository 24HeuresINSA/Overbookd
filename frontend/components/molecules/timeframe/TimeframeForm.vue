<template>
  <v-card class="form-card">
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
      <v-btn
        v-if="editIndex == -1"
        color="blue darken-1"
        text
        @click="addTimeframe"
      >
        Valider
      </v-btn>

      <v-btn v-else color="blue darken-1" text @click="editTimeframe">
        Modifier
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "TimeframeCalendar",
  props: {
    editIndex: {
      type: Number,
      default: () => -1,
    },
  },
  data: () => ({
    dateStart: "",
    dateEnd: "",
    timeStart: "",
    timeEnd: "",
    menuDateStart: false,
    menuTimeStart: false,
    menuDateEnd: false,
    menuTimeEnd: false,
  }),
  computed: {
    timeframes(): any {
      return this.$accessor.FA.mFA.time_windows;
    },
  },
  watch: {
    editIndex() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    this.updateLocalVariable();
  },
  methods: {
    allowedStep: (m: number) => m % 15 === 0,
    updateLocalVariable() {
      if (this.editIndex !== -1) {
        const timeframe = this.timeframes[this.editIndex];
        const start = new Date(timeframe.start);
        const end = new Date(timeframe.end);

        let year = start.getFullYear();
        let month = start.getMonth() + 1;
        let day = start.getDate();
        let hour = start.getHours();
        let minute = start.getMinutes();

        this.dateStart = `${year}-${month < 10 ? "0" + month : month}-${
          day < 10 ? "0" + day : day
        }`;

        this.timeStart = `${hour < 10 ? "0" + hour : hour}:${
          minute < 10 ? "0" + minute : minute
        }`;

        year = end.getFullYear();
        month = end.getMonth() + 1;
        day = end.getDate();
        hour = end.getHours();
        minute = end.getMinutes();

        this.dateEnd = `${year}-${month < 10 ? "0" + month : month}-${
          day < 10 ? "0" + day : day
        }`;
        this.timeEnd = `${hour < 10 ? "0" + hour : hour}:${
          minute < 10 ? "0" + minute : minute
        }`;
      } else {
        this.dateStart = "";
        this.dateEnd = "";
        this.timeStart = "";
        this.timeEnd = "";
      }
    },
    addTimeframe() {
      if (!this.dateStart || !this.timeStart || !this.dateEnd || !this.timeEnd)
        return;
      const timeframe = {
        start: new Date(this.dateStart + " " + this.timeStart),
        end: new Date(this.dateEnd + " " + this.timeEnd),
      };
      this.$accessor.FA.addTimeWindow(timeframe);
      this.$emit("close-dialog");
    },
    editTimeframe() {
      if (!this.dateStart || !this.timeStart || !this.dateEnd || !this.timeEnd)
        return;
      const timeframe = {
        start: new Date(this.dateStart + " " + this.timeStart),
        end: new Date(this.dateEnd + " " + this.timeEnd),
      };
      this.$accessor.FA.updateTimeWindow({
        index: this.editIndex,
        timeWindow: timeframe,
      });
      this.$emit("close-dialog");
    },
  },
});
</script>

<style scoped>
.form-card {
  display: flex;
  flex-direction: column;
}

.form-card .time-row {
  display: flex;
  margin: 0 24px;
}

.form-card .subtitle {
  margin: 10px 24px 0 24px;
}

.form-card .time-row .text-date {
  margin-right: 30px;
}
</style>
