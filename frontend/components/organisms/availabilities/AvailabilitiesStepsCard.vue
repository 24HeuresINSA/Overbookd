<template>
  <v-stepper v-model="step" alt-labels>
    <v-stepper-header>
      <v-stepper-step
        v-for="({ title }, index) in calendarSteps"
        :key="title"
        :complete="step > index + 1"
        :step="index + 1"
      >
        {{ title }}
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <div
        v-for="({ period }, index) in calendarSteps"
        :key="`${period.start}-${period.end}`"
      >
        <v-stepper-content :step="index + 1">
          <AvailabilitiesPickCalendar :period="period" />
          <v-card-actions>
            <v-btn v-if="index > 0" @click="decrementStep"> Précédent </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="index < calendarSteps.length - 1"
              color="primary"
              @click="incrementStep"
            >
              Suivant
            </v-btn>
          </v-card-actions>
        </v-stepper-content>
      </div>
    </v-stepper-items>
  </v-stepper>
</template>

<script lang="ts">
import Vue from "vue";
import AvailabilitiesPickCalendar from "~/components/molecules/timeframe/AvailabilitiesPickCalendar.vue";
import { Period } from "~/utils/models/period";

interface CalendarStep {
  title: string;
  period: Period;
}

export default Vue.extend({
  name: "AvailabilitiesStepsCard",
  components: { AvailabilitiesPickCalendar },
  data: () => ({
    step: 1,
  }),
  computed: {
    isHardUser(): boolean {
      return this.$accessor.user.hasPermission("hard");
    },
    softCalendarSteps(): CalendarStep[] {
      return [this.preManifStep, this.manifStep, this.postManifStep];
    },
    hardCalendarSteps(): CalendarStep[] {
      return [this.prePreManifStep, ...this.softCalendarSteps];
    },
    calendarSteps(): CalendarStep[] {
      return this.isHardUser ? this.hardCalendarSteps : this.softCalendarSteps;
    },
    prePreManifStep(): CalendarStep {
      return {
        title: "Pré-pré-festival",
        period: {
          start: new Date("2023-05-01"),
          end: new Date("2023-05-07"),
        },
      };
    },
    preManifStep(): CalendarStep {
      return {
        title: "Pré-festival",
        period: {
          start: new Date("2023-05-08"),
          end: new Date("2023-05-11"),
        },
      };
    },
    manifStep(): CalendarStep {
      return {
        title: "Festival",
        period: {
          start: new Date("2023-05-12"),
          end: new Date("2023-05-15"),
        },
      };
    },
    postManifStep(): CalendarStep {
      return {
        title: "Post-festival",
        period: {
          start: new Date("2023-05-16"),
          end: new Date("2023-05-17"),
        },
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
