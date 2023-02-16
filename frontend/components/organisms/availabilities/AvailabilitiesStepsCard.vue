<template>
  <div>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          Pré-pré-festival
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">
          Pré-festival
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 3" step="3">
          Festival
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 4" step="4">
          Post-festival
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <AvailabilitiesPickCalendar :period="prePreManifPeriod" />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="incrementStep"> Suivant </v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-content step="2">
          <AvailabilitiesPickCalendar :period="preManifPeriod" />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="decrementStep"> Précédent </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="incrementStep"> Suivant </v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-content step="3">
          <AvailabilitiesPickCalendar :period="manifPeriod" />
          <v-card-actions>
            <v-btn @click="decrementStep"> Précédent </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="incrementStep"> Suivant </v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-content step="4">
          <AvailabilitiesPickCalendar :period="postManifPeriod" />
          <v-card-actions>
            <v-btn @click="decrementStep"> Précédent </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success"> Sauvegarder et terminer </v-btn>
          </v-card-actions>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AvailabilitiesPickCalendar from "~/components/molecules/timeframe/AvailabilitiesPickCalendar.vue";
import { Period } from "~/utils/models/period";

export default Vue.extend({
  name: "AvailabilitiesStepsCard",
  components: { AvailabilitiesPickCalendar },
  data: () => ({
    step: 1,
  }),
  computed: {
    prePreManifPeriod(): Period {
      return {
        start: new Date("2023-05-01"),
        end: new Date("2023-05-07"),
      };
    },
    preManifPeriod(): Period {
      return {
        start: new Date("2023-05-08"),
        end: new Date("2023-05-11"),
      };
    },
    manifPeriod(): Period {
      return {
        start: new Date("2023-05-12"),
        end: new Date("2023-05-15"),
      };
    },
    postManifPeriod(): Period {
      return {
        start: new Date("2023-05-16"),
        end: new Date("2023-05-17"),
      };
    },
  },
  methods: {
    decrementStep() {
      this.step--;
    },
    incrementStep() {
      this.step++;
    },
  },
});
</script>
