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
    isEditForm(): boolean {
      return this.availability !== null;
    },
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
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
      const availability = {
        start: this.start,
        end: this.end,
        charisma: this.charisma,
      };
      this.$emit("confirm", availability);
    },
  },
});
</script>
