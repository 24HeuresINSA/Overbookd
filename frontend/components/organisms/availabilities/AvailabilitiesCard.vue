<template>
  <div>
    <v-stepper v-model="step">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          8 au 14 mai
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">
          15 au 17 mai
        </v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <AvailabilitiesPickCalendar
            start="2023-05-08 00:00"
            end="2023-05-14 23:59"
          />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="incrementStep"> Suivant </v-btn>
          </v-card-actions>
        </v-stepper-content>

        <v-stepper-content step="2">
          <AvailabilitiesPickCalendar
            start="2023-05-15 00:00"
            end="2023-05-17 23:59"
          />
          <v-card-actions>
            <v-btn @click="decrementStep"> Précédent </v-btn>
            <v-spacer></v-spacer>
            <v-btn color="success"> Valider </v-btn>
          </v-card-actions>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import AvailabilitiesPickCalendar from "~/components/molecules/timeframe/AvailabilitiesPickCalendar.vue";

export default Vue.extend({
  name: "AvailabilitiesCard",
  components: { AvailabilitiesPickCalendar },
  data: () => ({
    step: 1,
  }),
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
