<template>
  <v-card class="form-card">
    <v-card-title>
      <span v-if="editIndex === -1" class="headline">Ajouter un créneau</span>
      <span v-else class="headline">Modifier un créneau</span>
    </v-card-title>

    <v-select
      v-model="mTimeWindow.type"
      type="select"
      label="Type"
      :items="editIndex === -1 ? addTimeWindowsType : editTimeWindowsType"
      class="row"
    ></v-select>

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
          v-model="mTimeWindow.dateStart"
          :max="formatDateEnd ? mTimeWindow.dateEnd : ''"
          first-day-of-week="1"
          @input="
            menuDateStart = false;
            formatDateStart = formatDate(mTimeWindow.dateStart);
          "
        ></v-date-picker>
      </v-menu>

      <v-menu
        ref="menuTimeStart"
        v-model="menuTimeStart"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="mTimeWindow.timeStart"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="mTimeWindow.timeStart"
            label="Heure de début"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="menuTimeStart"
          v-model="mTimeWindow.timeStart"
          :allowed-minutes="allowedStep"
          format="24hr"
          scrollable
          full-width
          :max="
            mTimeWindow.dateStart == mTimeWindow.dateEnd
              ? mTimeWindow.timeEnd
              : ''
          "
          @click:minute="
            saveMenuTime($refs.menuTimeStart, mTimeWindow.timeStart)
          "
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
          v-model="mTimeWindow.dateEnd"
          :min="formatDateStart ? mTimeWindow.dateStart : ''"
          first-day-of-week="1"
          @input="
            menuDateEnd = false;
            formatDateEnd = formatDate(mTimeWindow.dateEnd);
          "
        ></v-date-picker>
      </v-menu>

      <v-menu
        ref="menuTimeEnd"
        v-model="menuTimeEnd"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="mTimeWindow.timeEnd"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="mTimeWindow.timeEnd"
            label="Heure de fin"
            prepend-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          v-if="menuTimeEnd"
          v-model="mTimeWindow.timeEnd"
          :allowed-minutes="allowedStep"
          format="24hr"
          scrollable
          full-width
          :min="
            mTimeWindow.dateStart == mTimeWindow.dateEnd
              ? mTimeWindow.timeStart
              : ''
          "
          @click:minute="saveMenuTime($refs.menuTimeEnd, mTimeWindow.timeEnd)"
        ></v-time-picker>
      </v-menu>
    </div>
    <v-card-text
      >Les activités en journée se passent entre 11h et 18h.</v-card-text
    >

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="editIndex === -1"
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
import { time_windows, time_windows_type } from "~/utils/models/FA";

export default Vue.extend({
  name: "TimeframeCalendar",
  props: {
    editIndex: {
      type: Number,
      default: () => -1,
    },
  },
  data: () => ({
    mTimeWindow: {} as my_time_windows,

    formatDateStart: "",
    formatDateEnd: "",

    menuDateStart: false,
    menuTimeStart: false,
    menuDateEnd: false,
    menuTimeEnd: false,
  }),
  computed: {
    timeframes(): any {
      return this.$accessor.FA.mFA.time_windows;
    },
    addTimeWindowsType(): string[] {
      return [...Object.values(time_windows_type), "Les deux"];
    },
    editTimeWindowsType(): string[] {
      return Object.values(time_windows_type);
    },
    manifDate(): string {
      return this.$accessor.config.getConfig("event_date");
    },
    shouldCreateBothTimeWindows(): boolean {
      return !Object.values(time_windows_type).includes(
        this.mTimeWindow.type as any
      );
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

        this.mTimeWindow.dateStart = `${year}-${
          month < 10 ? "0" + month : month
        }-${day < 10 ? "0" + day : day}`;
        this.formatDateStart = this.formatDate(this.mTimeWindow.dateStart);

        this.mTimeWindow.timeStart = `${hour < 10 ? "0" + hour : hour}:${
          minute < 10 ? "0" + minute : minute
        }`;

        year = end.getFullYear();
        month = end.getMonth() + 1;
        day = end.getDate();
        hour = end.getHours();
        minute = end.getMinutes();

        this.mTimeWindow.dateEnd = `${year}-${
          month < 10 ? "0" + month : month
        }-${day < 10 ? "0" + day : day}`;
        this.formatDateEnd = this.formatDate(this.mTimeWindow.dateEnd);

        this.mTimeWindow.timeEnd = `${hour < 10 ? "0" + hour : hour}:${
          minute < 10 ? "0" + minute : minute
        }`;

        this.mTimeWindow.type = timeframe.type;
      } else this.clearLocalVariable();
    },
    clearLocalVariable() {
      this.mTimeWindow = {} as my_time_windows;
      this.mTimeWindow.dateStart = this.manifDate;
      this.mTimeWindow.dateEnd = this.manifDate;

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

      const timewindowTypes = this.shouldCreateBothTimeWindows
        ? [time_windows_type.ANIM, time_windows_type.MATOS]
        : [this.mTimeWindow.type as time_windows_type];
      timewindowTypes.map((timewindowType: time_windows_type) =>
        this.addTimeWindowInStore(timewindowType)
      );

      this.$emit("close-dialog");
      this.clearLocalVariable();
    },
    addTimeWindowInStore(type?: time_windows_type) {
      if (type) this.mTimeWindow.type = type;
      this.$accessor.FA.addTimeWindow(this.getValidTimeWindow());
    },
    editTimeframe() {
      if (this.formIsInvalid()) return;

      this.$accessor.FA.updateTimeWindow({
        index: this.editIndex,
        timeWindow: this.getValidTimeWindow(),
      });
      this.$emit("close-dialog");
    },
    formIsInvalid(): boolean {
      if (
        !this.mTimeWindow.type ||
        !this.mTimeWindow.dateStart ||
        !this.formatDateStart ||
        !this.formatDateEnd ||
        !this.mTimeWindow.timeStart ||
        !this.mTimeWindow.dateEnd ||
        !this.mTimeWindow.timeEnd
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
    getValidTimeWindow(): time_windows {
      return {
        type: this.mTimeWindow.type as time_windows_type,
        start: new Date(
          this.mTimeWindow.dateStart + " " + this.mTimeWindow.timeStart
        ),
        end: new Date(
          this.mTimeWindow.dateEnd + " " + this.mTimeWindow.timeEnd
        ),
      };
    },
    saveMenuTime(menu: any, time: string) {
      menu.save(time);
    },
  },
});

interface my_time_windows {
  dateStart: string;
  dateEnd: string;
  timeStart: string;
  timeEnd: string;
  type: time_windows_type | string;
}
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
