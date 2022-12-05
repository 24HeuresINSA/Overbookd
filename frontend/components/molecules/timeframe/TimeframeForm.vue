<template>
  <v-card class="form-card">
    <v-card-title>
      <span class="headline">Ajouter un créneau</span>
    </v-card-title>

    <h3 class="subtitle">Début du créneau</h3>
    <div class="row">
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
            v-model="formatDateStart"
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
          :max="formatDateEnd ? dateEnd : ''"
          first-day-of-week="1"
          @input="
            menuDateStart = false;
            formatDateStart = formatDate(dateStart);
          "
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
          @click:minute="saveMenuTime($refs.menuTimeStart, timeStart)"
        ></v-time-picker>
      </v-menu>
    </div>

    <h3 class="subtitle">Fin du créneau</h3>
    <div class="row">
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
            v-model="formatDateEnd"
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
          :min="formatDateStart ? dateStart : ''"
          first-day-of-week="1"
          @input="
            menuDateEnd = false;
            formatDateEnd = formatDate(dateEnd);
          "
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
          @click:minute="saveMenuTime($refs.menuTimeEnd, timeEnd)"
        ></v-time-picker>
      </v-menu>
    </div>
    <v-card-text
      >Les activités en journée se passent entre 11h et 18h.</v-card-text
    >

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="timeWindow"
        color="blue darken-1"
        text
        @click="editTimeframe"
      >
        Modifier
      </v-btn>
      <v-btn v-else color="blue darken-1" text @click="addTimeframe">
        Valider
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { time_windows, time_windows_type } from "~/utils/models/FA";

interface BrakeDownDate {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

export default Vue.extend({
  name: "TimeframeForm",
  model: {
    prop: "timeWindow",
    event: "change",
  },
  props: {
    timeWindow: {
      type: Object,
      default: () => null,
    },
    type: {
      type: String,
      default: () => time_windows_type.ANIM,
    },
  },
  data: () => ({
    dateStart: "",
    dateEnd: "",
    timeStart: "",
    timeEnd: "",

    formatDateStart: "",
    formatDateEnd: "",

    menuDateStart: false,
    menuTimeStart: false,
    menuDateEnd: false,
    menuTimeEnd: false,
  }),
  computed: {
    mTimeWindow(): time_windows {
      return {
        start: new Date(this.dateStart + " " + this.timeStart),
        end: new Date(this.dateEnd + " " + this.timeEnd),
        type: this.type as time_windows_type,
      };
    },
    timeframes(): any {
      return this.$accessor.FA.mFA.time_windows;
    },
    timeWindowsType(): Array<string> {
      return Object.values(time_windows_type);
    },
    manifDate(): string {
      return this.$accessor.config.getConfig("event_date");
    },
  },
  watch: {
    timeWindow() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    this.updateLocalVariable();
  },
  methods: {
    allowedStep(m: number): boolean {
      return m % 15 === 0;
    },
    setStart(startDate: Date) {
      const { date, formatDate, time } = this.buildLocalDateValues(startDate);

      this.dateStart = date;
      this.formatDateStart = formatDate;
      this.timeStart = time;
    },
    setEnd(endDate: Date) {
      const { date, formatDate, time } = this.buildLocalDateValues(endDate);

      this.dateEnd = date;
      this.formatDateEnd = formatDate;
      this.timeEnd = time;
    },
    buildLocalDateValues(date: Date) {
      const brakeDownDate = this.breakDownDate(date);
      const rawDate = this.buildRawDate(brakeDownDate);
      return {
        date: rawDate,
        formatDate: this.formatDate(rawDate),
        time: this.buildRawTime(brakeDownDate),
      };
    },

    breakDownDate(date: Date): BrakeDownDate {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      return {
        year,
        month,
        day,
        hour,
        minute,
      };
    },
    buildRawDate({ year, month, day }: BrakeDownDate): string {
      return `${year}-${month < 10 ? "0" + month : month}-${
        day < 10 ? "0" + day : day
      }`;
    },
    buildRawTime({ hour, minute }: BrakeDownDate): string {
      return `${hour < 10 ? "0" + hour : hour}:${
        minute < 10 ? "0" + minute : minute
      }`;
    },
    updateLocalVariable() {
      if (!this.timeWindow) {
        return this.clearLocalVariable();
      }
      const start = new Date(this.timeWindow.start);
      const end = new Date(this.timeWindow.end);

      this.setStart(start);
      this.setEnd(end);
    },
    clearLocalVariable() {
      this.dateStart = this.manifDate;
      this.dateEnd = this.manifDate;
      this.timeStart = "";
      this.timeEnd = "";

      this.formatDateStart = "";
      this.formatDateEnd = "";
    },
    formatDate(date: string): string {
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    },
    addTimeframe() {
      if (this.formIsInvalid()) return;

      this.$emit("change", this.mTimeWindow);
      this.$emit("close-dialog");
      this.clearLocalVariable();
    },
    editTimeframe() {
      if (this.formIsInvalid()) return;

      this.$emit("change", this.mTimeWindow);
      this.$emit("close-dialog");
    },
    formIsInvalid(): boolean {
      if (
        !this.mTimeWindow.type ||
        !this.dateStart ||
        !this.formatDateStart ||
        !this.formatDateEnd ||
        !this.timeStart ||
        !this.dateEnd ||
        !this.timeEnd
      ) {
        this.showErrorMessage();
        return true;
      }
      return false;
    },
    showErrorMessage() {
      return this.$store.dispatch("notif/pushNotification", {
        type: "error",
        message: "❌ Tu dois compléter tous les champs !",
      });
    },
    saveMenuTime(menu: any, time: string) {
      menu.save(time);
    },
  },
});
</script>

<style scoped>
.form-card {
  display: flex;
  flex-direction: column;
}

.form-card .subtitle {
  margin: 10px 24px 0 24px;
}

.form-card .row {
  display: flex;
  margin: 0 24px;
}

.form-card .time-row .text-date {
  margin-right: 30px;
}
</style>
