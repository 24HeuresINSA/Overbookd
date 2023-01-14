<template>
  <div>
    <v-card class="form-card">
      <v-card-title>
        <span class="headline">Ajouter un créneau</span>
      </v-card-title>

      <v-card-text>
        <h3>Début du créneau</h3>
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
              @input="closeStartDatePicker"
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

        <h3>Fin du créneau</h3>
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
              @input="closeEndDatePicker"
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

        <h3>Découpage du créneau</h3>
        <v-checkbox v-model="toSlice" label="Découper"></v-checkbox>
        <v-slider
          v-model="sliceTime"
          label="Nombre d'heures par découpage"
          :disabled="!toSlice"
          min="0.5"
          max="4"
          step="0.5"
          thumb-label="always"
        ></v-slider>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="confirmTimeWindows">
          {{ isEditForm ? "Modifier" : "Ajouter" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { FT, FTTimeWindow } from "~/utils/models/ft";

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

    toSlice: false,
    sliceTime: 2,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    mTimeWindow(): FTTimeWindow {
      return {
        start: this.createDate(this.dateStart, this.timeStart),
        end: this.createDate(this.dateEnd, this.timeEnd),
        sliceTime: this.toSlice ? this.sliceTime : undefined,
      };
    },
    manifDate(): string {
      return this.$accessor.config.getConfig("event_date");
    },
    isEditForm(): boolean {
      return this.timeWindow !== null;
    },
    isFormInvalid(): boolean {
      const requiredFieldsFilled =
        this.formatDateStart &&
        this.formatDateEnd &&
        this.dateStart &&
        this.timeStart &&
        this.dateEnd &&
        this.timeEnd;
      if (!requiredFieldsFilled) {
        this.showIncompleteErrorMessage();
        return true;
      }

      const isSliceValid = this.getHourDiff % this.sliceTime === 0;
      const sliceInOneTimeWindow = this.getHourDiff === this.sliceTime;
      if (this.toSlice && (!isSliceValid || sliceInOneTimeWindow)) {
        this.showSliceErrorMessage();
        return true;
      }
      return false;
    },
    getHourDiff(): number {
      const start = this.createDate(this.dateStart, this.timeStart);
      const end = this.createDate(this.dateEnd, this.timeEnd);
      const diff = end.getTime() - start.getTime();
      return diff / (1000 * 60 * 60);
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
    createDate(date: string, time: string): Date {
      return new Date(date + " " + time);
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
      if (!this.isEditForm) return this.clearLocalVariable();

      const start = new Date(this.timeWindow.start);
      const end = new Date(this.timeWindow.end);

      this.setStart(start);
      this.setEnd(end);

      this.toSlice = this.timeWindow.sliceTime !== undefined;
      this.sliceTime = this.timeWindow.sliceTime || 2;
    },
    clearLocalVariable() {
      this.dateStart = this.manifDate;
      this.dateEnd = this.manifDate;
      this.timeStart = "";
      this.timeEnd = "";

      this.formatDateStart = "";
      this.formatDateEnd = "";

      this.toSlice = false;
      this.sliceTime = 2;
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
    formatDate(date: string): string {
      const displayOptions: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
      return new Intl.DateTimeFormat("fr", displayOptions).format(
        new Date(date)
      );
    },
    confirmTimeWindows() {
      if (this.isFormInvalid) return;

      this.$emit("change", this.mTimeWindow);
      if (!this.isEditForm) this.clearLocalVariable();
    },
    showIncompleteErrorMessage() {
      return this.$store.dispatch("notif/pushNotification", {
        type: "error",
        message: "❌ Tu dois compléter tous les champs !",
      });
    },
    showSliceErrorMessage() {
      return this.$store.dispatch("notif/pushNotification", {
        type: "error",
        message: `❌ La durée de la plage horaire doit être un multiple de ${this.sliceTime}h !`,
      });
    },
    saveMenuTime(menu: any, time: string) {
      menu.save(time);
    },
    closeStartDatePicker() {
      this.menuDateStart = false;
      this.formatDateStart = this.formatDate(this.dateStart);
    },
    closeEndDatePicker() {
      this.menuDateEnd = false;
      this.formatDateEnd = this.formatDate(this.dateEnd);
    },
  },
});
</script>

<style lang="scss" scoped>
.form-card {
  display: flex;
  flex-direction: column;

  .row {
    display: flex;
    flex-direction: row;
    margin-top: 3px;
    margin-bottom: 7px;

    .v-text-field {
      margin: 0 24px;
    }
  }

  .text-date {
    margin-right: 30px;
  }
}
</style>
