<template>
  <v-card class="time-window-card">
    <v-btn class="time-window-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="time-window-card__title">
      <h2>Ajouter un créneau</h2>
    </v-card-title>

    <v-card-subtitle>
      La manif commencera le {{ displayedManifDate }}.
    </v-card-subtitle>

    <v-card-text class="pb-0">
      <h3>Début du créneau</h3>
      <DateTimeField v-model="start" label="Début" />

      <h3>Fin du créneau</h3>
      <DateTimeField v-model="end" label="Fin" />
    </v-card-text>

    <v-card-actions class="time-window-card__actions">
      <v-btn color="success" dark large @click="addTimeWindow">
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        Ajouter le créneau
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import { formatDate } from "~/utils/date/date.utils";

interface FaTimeWindowFormData {
  start: Date;
  end: Date;
}

export default defineComponent({
  name: "FaTimeWindowForm",
  components: { DateTimeField },
  data: (): FaTimeWindowFormData => ({
    start: new Date(),
    end: new Date(),
  }),
  computed: {
    canAddTimeWindow(): boolean {
      const startBeforeEnd = this.start < this.end;
      if (!startBeforeEnd) {
        this.$accessor.notif.pushNotification({
          message: "❌ La date de début doit être avant la date de fin !",
        });
        return false;
      }
      return true;
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    displayedManifDate(): string {
      return `vendredi ${formatDate(this.manifDate)}`;
    },
  },
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.setDefaultDates();
  },
  methods: {
    setDefaultDates() {
      this.start = this.manifDate;
      this.end = this.manifDate;
    },
    addTimeWindow() {
      if (!this.canAddTimeWindow) return;
      const period = { start: this.start, end: this.end };
      this.$emit("add", period);

      this.closeDialog();
      this.setDefaultDates();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.time-window-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__form {
    padding-bottom: 0;
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
