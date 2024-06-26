<template>
  <v-card>
    <v-card-title>
      {{ isEditForm ? "Modifier" : "Ajouter" }} un créneau
    </v-card-title>

    <v-card-text>
      <v-form v-model="isFormValid">
        <v-text-field
          v-model="name"
          label="Nom"
          :rules="[rules.required]"
        ></v-text-field>
        <v-text-field v-model="description" label="Description"></v-text-field>
        <DateTimeField
          v-model="start"
          label="Début"
          :boxed="false"
          :step="60"
        ></DateTimeField>
        <DateTimeField
          v-model="end"
          label="Fin"
          :boxed="false"
          :step="60"
        ></DateTimeField>
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
import { CharismaPeriod, SavedCharismaPeriod } from "@overbookd/http";
import Vue from "vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import { isNumber, min, required } from "~/utils/rules/input.rules";

export default Vue.extend({
  name: "CharismaPeriodForm",
  components: { DateTimeField },
  props: {
    charismaPeriod: {
      type: Object,
      default: () => null as SavedCharismaPeriod | null,
    },
  },
  data: () => ({
    name: "",
    description: "",
    start: undefined as Date | undefined,
    end: undefined as Date | undefined,
    charisma: "0",

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
      return this.$accessor.configuration.eventStartDate;
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
          "❌ La date de début doit être avant la date de fin !",
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
        if (this.isEditForm && cp.id === this.charismaPeriod?.id) return false;
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
    await this.$accessor.configuration.fetch("eventDate");
    this.updateLocalVariable();
  },
  methods: {
    updateLocalVariable() {
      if (!this.isEditForm) return this.clearLocalVariable();

      this.name = this.charismaPeriod.name;
      this.description = this.charismaPeriod.description;
      this.start = this.charismaPeriod?.start ?? this.manifDate;
      this.end = this.charismaPeriod?.end ?? this.manifDate;
      this.charisma = this.charismaPeriod?.charisma.toString();
    },
    clearLocalVariable() {
      this.name = "";
      this.description = "";
      this.start = this.manifDate;
      this.end = this.manifDate;
      this.charisma = "0";
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
        charisma: +this.charisma,
      };
      this.$emit("create", charismaPeriod);
      this.clearLocalVariable();
    },
    updateCharismaPeriod() {
      const charismaPeriod: SavedCharismaPeriod = {
        id: this.charismaPeriod.id,
        name: this.name,
        description: this.description,
        start: this.start ?? this.charismaPeriod.start,
        end: this.end ?? this.charismaPeriod.end,
        charisma: +this.charisma,
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
