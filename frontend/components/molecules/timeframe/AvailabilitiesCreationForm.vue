<template>
  <v-card>
    <v-card-title>
      {{ isEditForm ? "Modifier" : "Ajouter" }} une disponibilité
    </v-card-title>

    <v-card-text>
      <h3>Début du créneau</h3>
      <DateField v-model="start" label="Début" :step="60"></DateField>

      <h3>Fin du créneau</h3>
      <DateField v-model="end" label="Fin" :step="60"></DateField>

      <v-text-field
        v-model="charisma"
        type="number"
        label="Charisme par heure"
        :rules="[rules.number, rules.min]"
      ></v-text-field>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="confirmAvailability">
        {{ isEditForm ? "Modifier" : "Ajouter" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import DateField from "~/components/atoms/DateField.vue";
import { isNumber, min } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "AvailabilitiesCreationForm",
  components: { DateField },
  props: {
    availability: {
      type: Object,
      default: () => null,
    },
  },
  data: () => ({
    start: undefined,
    end: undefined,
    charisma: 0,
    rules: {
      number: isNumber,
      min: min(0),
    },
  }),
  computed: {
    availabilities(): any[] {
      // TODO: call store
      return [
        {
          start: new Date("2023-05-12 22:00"),
          end: new Date("2023-05-13 02:00"),
          charisma: 10,
        },
        {
          start: new Date("2023-05-11 00:00"),
          end: new Date("2023-05-12 20:00"),
          charisma: 5,
        },
        {
          start: new Date("2023-05-10 00:00"),
          end: new Date("2023-05-10 20:00"),
          charisma: 1,
        },
      ];
    },
    isEditForm(): boolean {
      return this.availability !== null;
    },
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
    startOrManifDate(): Date {
      return this.start ?? this.manifDate;
    },
    endOrManifDate(): Date {
      return this.end ?? this.manifDate;
    },
    isAvailabilityInvalid(): boolean {
      const requiredFieldsFilled =
        this.start && this.end && this.charisma !== undefined;
      if (!requiredFieldsFilled) {
        this.showErrorMessage("❌ Tu dois compléter tous les champs !");
        return true;
      }

      const startBeforeEnd = this.startOrManifDate < this.endOrManifDate;
      if (!startBeforeEnd) {
        this.showErrorMessage(
          "❌ La date de début doit être avant la date de fin !"
        );
        return true;
      }

      if (this.hasOverlap) {
        this.showErrorMessage("❌ Ce créneau en chevauche un autre !");
        return true;
      }

      return false;
    },
    hasOverlap(): boolean {
      if (this.start === undefined || this.end === undefined) return false;
      const start = this.start;
      const end = this.end;
      return this.availabilities.some((a) => {
        return (
          (start > a.start && start < a.end) || (end > a.start && end < a.end)
        );
      });
    },
  },
  watch: {
    availability() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {
      this.start = this.availability?.start ?? this.manifDate;
      this.end = this.availability?.end ?? this.manifDate;
      this.charisma = this.availability?.charisma ?? 0;
    },
    confirmAvailability() {
      if (this.isAvailabilityInvalid) return;
      const availability = {
        start: this.startOrManifDate,
        end: this.startOrManifDate,
        charisma: this.charisma,
      };
      this.$emit("confirm", availability);
    },
    showErrorMessage(message: string) {
      return this.$store.dispatch("notif/pushNotification", {
        type: "error",
        message,
      });
    },
  },
});
</script>
