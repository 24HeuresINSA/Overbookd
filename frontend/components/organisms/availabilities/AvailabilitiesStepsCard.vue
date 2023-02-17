<!-- eslint-disable vue/valid-v-for -->
<template>
  <div>
    <v-stepper v-model="step">
      <v-stepper-header>
        <template v-for="({ title }, index) in calendarSteps">
          <v-stepper-step :step="index + 1" :complete="step > index + 1">
            {{ title }}
          </v-stepper-step>
          <v-divider
            v-if="index < calendarSteps.length - 1"
            :key="`divider-${index}`"
          />
        </template>
      </v-stepper-header>

      <v-stepper-items>
        <template v-for="({ period }, index) in calendarSteps">
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
        </template>
      </v-stepper-items>
    </v-stepper>
  </div>
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
