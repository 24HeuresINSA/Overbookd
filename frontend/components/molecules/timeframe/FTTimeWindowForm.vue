<template>
  <div>
    <v-card class="form-card">
      <v-card-title>
        <span class="headline">Ajouter un créneau</span>
      </v-card-title>

      <v-card-text>
        <h3>Début du créneau</h3>
        <DateField v-model="start" :max="end" label="Début"></DateField>

        <h3>Fin du créneau</h3>
        <DateField v-model="end" :min="start" label="Fin"></DateField>

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
import DateField from "~/components/atoms/DateField.vue";
import { formatDateForComponent, getHourDiff } from "~/utils/date/dateUtils";
import { FT, FTTimeWindow } from "~/utils/models/ft";

export default Vue.extend({
  name: "TimeframeForm",
  components: { DateField },
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
    start: "",
    end: "",
    toSlice: false,
    sliceTime: 2,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    mTimeWindow(): FTTimeWindow {
      return {
        start: new Date(this.start),
        end: new Date(this.end),
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
      const requiredFieldsFilled = this.start && this.end;
      if (!requiredFieldsFilled) {
        this.showErrorMessage("❌ Tu dois compléter tous les champs !");
        return true;
      }

      const startBeforeEnd = this.start < this.end;
      if (!startBeforeEnd) {
        this.showErrorMessage(
          "❌ La date de début doit être avant la date de fin !"
        );
        return true;
      }

      const hourDiff = getHourDiff(new Date(this.start), new Date(this.end));
      const isSliceValid = hourDiff % this.sliceTime === 0;
      const sliceInOneTimeWindow = hourDiff === this.sliceTime;
      if (this.toSlice && (!isSliceValid || sliceInOneTimeWindow)) {
        this.showErrorMessage(
          `❌ La durée de la plage horaire doit être un multiple de ${this.sliceTime}h !`
        );
        return true;
      }
      return false;
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
    updateLocalVariable() {
      if (!this.isEditForm) return this.clearLocalVariable();
      this.start = formatDateForComponent(this.timeWindow.start);
      this.end = formatDateForComponent(this.timeWindow.end);
      this.toSlice = this.timeWindow.sliceTime !== undefined;
      this.sliceTime = this.timeWindow.sliceTime || 2;
    },
    clearLocalVariable() {
      this.start = "";
      this.end = "";
      this.toSlice = false;
      this.sliceTime = 2;
    },
    confirmTimeWindows() {
      if (this.isFormInvalid) return;
      this.$emit("change", this.mTimeWindow);
      if (!this.isEditForm) this.clearLocalVariable();
    },
    showErrorMessage(message: string) {
      return this.$store.dispatch("notif/pushNotification", {
        type: "error",
        message,
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
  },
});
</script>

<style lang="scss" scoped>
.form-card {
  display: flex;
  flex-direction: column;
}
</style>
