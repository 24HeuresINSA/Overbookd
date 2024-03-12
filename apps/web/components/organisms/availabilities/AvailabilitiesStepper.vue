<template>
  <v-stepper v-model="step">
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
      <v-stepper-content
        v-for="({ period }, index) in calendarSteps"
        :id="`calendar-part-${index + 1}`"
        :key="`${period.start}-${period.end}`"
        :step="index + 1"
        class="content-calendar"
      >
        <v-card-actions class="cta">
          <v-btn
            color="success"
            :disabled="hasAvailabilityError"
            @click="saveAvailabilities"
          >
            Valider
          </v-btn>
        </v-card-actions>

        <AvailabilitiesPickCalendar
          :period="period"
          :disable-next-period="shouldDisableNextOn(index + 1)"
          :disable-previous-period="shouldDisablePreviousOn(index + 1)"
          @reach:period-end="incrementStep"
          @reach:period-start="decrementStep"
        />

        <v-card-actions class="cta">
          <v-btn
            color="success"
            :disabled="hasAvailabilityError"
            @click="saveAvailabilities"
          >
            Valider
          </v-btn>
        </v-card-actions>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script lang="ts">
import Vue from "vue";
import { OverDate, Period } from "@overbookd/period";
import AvailabilitiesPickCalendar from "~/components/molecules/availabilities/AvailabilitiesPickCalendar.vue";

type CalendarStep = {
  title: string;
  period: Period;
}

export default Vue.extend({
  name: "AvailabilitiesStepper",
  components: { AvailabilitiesPickCalendar },
  data: () => ({
    step: 1,
  }),
  computed: {
    isHard() {
      return this.$accessor.user.me.teams.includes("hard");
    },
    softCalendarSteps(): CalendarStep[] {
      return [this.preManifStep, this.manifStep, this.postManifStep];
    },
    hardCalendarSteps(): CalendarStep[] {
      return [this.prePreManifStep, ...this.softCalendarSteps];
    },
    calendarSteps(): CalendarStep[] {
      return this.isHard ? this.hardCalendarSteps : this.softCalendarSteps;
    },
    prePreManifStep(): CalendarStep {
      return {
        title: "Pré-pré-festival",
        period: Period.init({
          start: OverDate.init({ date: "2024-05-06", hour: 0 }).date,
          end: OverDate.init({ date: "2024-05-12", hour: 0 }).date,
        }),
      };
    },
    preManifStep(): CalendarStep {
      return {
        title: "Pré-festival",
        period: Period.init({
          start: OverDate.init({ date: "2024-05-13", hour: 0 }).date,
          end: OverDate.init({ date: "2024-05-16", hour: 0 }).date,
        }),
      };
    },
    manifStep(): CalendarStep {
      return {
        title: "Festival",
        period: Period.init({
          start: OverDate.init({ date: "2024-05-17", hour: 0 }).date,
          end: OverDate.init({ date: "2024-05-20", hour: 0 }).date,
        }),
      };
    },
    postManifStep(): CalendarStep {
      return {
        title: "Post-festival",
        period: Period.init({
          start: OverDate.init({ date: "2024-05-21", hour: 0 }).date,
          end: OverDate.init({ date: "2024-05-23", hour: 0 }).date,
        }),
      };
    },
    hasAvailabilityError(): boolean {
      return (
        this.$accessor.volunteerAvailability.availabilities.errors.length > 0
      );
    },
  },
  methods: {
    shouldDisableNextOn(periodCount: number): boolean {
      const isLastPeriod = this.calendarSteps.length === periodCount;
      return isLastPeriod;
    },
    shouldDisablePreviousOn(periodCount: number): boolean {
      const isFirstPeriod = periodCount === 1;
      return isFirstPeriod;
    },
    decrementStep() {
      this.step--;
    },
    incrementStep() {
      this.step++;
    },
    async saveAvailabilities() {
      return this.$accessor.volunteerAvailability.updateVolunteerAvailabilities(
        +this.$accessor.user.me.id,
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.content-calendar {
  padding-top: 5px;
}

.cta {
  display: flex;
  justify-content: center;
}

@media only screen and (max-width: 960px) {
  @for $index from 1 through 5 {
    #calendar-part-#{$index} {
      padding: 5px 0 16px 0;
    }
  }
}
</style>
