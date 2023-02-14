<template>
  <v-card>
    <v-card-title>
      {{ isEditForm ? "Modifier" : "Ajouter" }} un créneau
    </v-card-title>

    <v-card-text>
      <v-form v-model="isFormValid">
        <v-text-field
          v-model="name"
          label="Nom du créneau"
          :rules="[rules.required]"
        ></v-text-field>

        <v-text-field
          v-model="description"
          label="Description du créneau"
        ></v-text-field>

        <h4>Début du créneau</h4>
        <DateField v-model="start" label="Début" :step="60"></DateField>

        <h4>Fin du créneau</h4>
        <DateField v-model="end" label="Fin" :step="60"></DateField>

        <v-text-field
          v-model="charisma"
          type="number"
          label="Charisme par heure"
          :rules="[rules.number, rules.min]"
        ></v-text-field>
      </v-form>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" text @click="confirmCharismaPeriod">
        {{ isEditForm ? "Modifier" : "Ajouter" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import DateField from "~/components/atoms/DateField.vue";
import {
  CharismaPeriod,
  SavedCharismaPeriod,
} from "~/utils/models/charismaPeriod";
import { isNumber, min, required } from "~/utils/rules/inputRules";

export default Vue.extend({
  name: "CharismaPeriodForm",
  components: { DateField },
  props: {
    charismaPeriod: {
      type: Object,
      default: () => null as SavedCharismaPeriod | null,
    },
  },
  data: () => ({
    name: "",
    description: "",
    start: undefined,
    end: undefined,
    charisma: 0,

    isFormValid: false,
    rules: {
      number: isNumber,
      min: min(0),
      required,
    },
  }),
  computed: {
    charismaPeriods(): SavedCharismaPeriod[] {
      return this.$accessor.charismaPeriod.charismaPeriods;
    },
    isEditForm(): boolean {
      return this.charismaPeriod !== null;
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
    isCharismaPeriodInvalid(): boolean {
      const requiredFieldsFilled = this.isFormValid && this.start && this.end;
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
      return this.charismaPeriods.some((cp) => {
        return start < cp.end && end > cp.start;
      });
    },
  },
  watch: {
    charismaPeriod() {
      this.updateLocalVariable();
    },
  },
  async mounted() {
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {
      this.name = this.charismaPeriod?.name ?? "";
      this.description = this.charismaPeriod?.description ?? "";
      this.start = this.charismaPeriod?.start ?? this.manifDate;
      this.end = this.charismaPeriod?.end ?? this.manifDate;
      this.charisma = this.charismaPeriod?.charisma ?? 0;
    },
    confirmCharismaPeriod() {
      if (this.isCharismaPeriodInvalid) return;
      if (this.isEditForm) return this.updateCharismaPeriod();
      return this.addCharismaPeriod();
    },
    addCharismaPeriod() {
      const charismaPeriod: CharismaPeriod = {
        name: this.name,
        description: this.description,
        start: this.startOrManifDate,
        end: this.endOrManifDate,
        charisma: this.charisma,
      };
      this.$emit("create", charismaPeriod);
    },
    updateCharismaPeriod() {
      const charismaPeriod: SavedCharismaPeriod = {
        id: this.charismaPeriod.id,
        name: this.name,
        description: this.description,
        start: this.charismaPeriod.start,
        end: this.charismaPeriod.end,
        charisma: this.charisma,
      };
      this.$emit("update", charismaPeriod);
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
