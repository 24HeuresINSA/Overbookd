<template>
  <div>
    <OverCalendar v-model="calendarMarker" :title="calendarTitle">
      <template #interval="{ date, hour }">
        <div
          v-if="isEndOfPeriod(hour)"
          class="event"
          :class="{
            'two-hours': !isPartyShift(hour),
            'one-hour': isPartyShift(hour),
            selected: isSelected(date, hour),
            'is-error': hasError(date, hour),
            'read-only': isReadonly,
          }"
          @click="togglePeriod(date, hour)"
        ></div>
      </template>
    </OverCalendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Period } from "@overbookd/period";
import {
  AvailabilityDate,
  DateString,
  PeriodOrchestrator,
} from "@overbookd/volunteer-availability";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import {
  hasAvailabilityPeriodError,
  isEndOfAvailabilityPeriod,
} from "~/utils/availabilities/availabilities";
import {
  formatDateWithExplicitMonth,
} from "~/utils/date/date.utils";
import { isPartyShift } from "~/utils/shift/shift";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { UserPersonalData } from "@overbookd/user";

export default Vue.extend({
  name: "AvailabilitiesSumup",
  components: { OverCalendar },
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    selectedVolunteer(): UserPersonalData {
      return this.$accessor.user.selectedUser;
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    calendarTitle(): string {
      return formatDateWithExplicitMonth(this.calendarMarker);
    },
    periodOrchestrator(): PeriodOrchestrator {
      return this.$accessor.volunteerAvailability.periodOrchestrator;
    },
    selectedAvailabilities(): Period[] {
      return this.periodOrchestrator.availabilityPeriods;
    },
    isSelected(): (date: DateString, hour: number) => boolean {
      return (date: DateString, hour: number) => {
        const availabilityDate = AvailabilityDate.init({ date, hour });
        const periods = this.selectedAvailabilities;
        return availabilityDate.isIncludedBy(periods);
      };
    },
    hasError(): (date: string | Date, hour: number) => boolean {
      return hasAvailabilityPeriodError(this.periodOrchestrator);
    },
    isReadonly(): boolean {
      return !this.$accessor.user.can(AFFECT_VOLUNTEER);
    },
  },
  watch: {
    userId() {
      this.fetchAvailabilities();
    },
  },
  mounted() {
    this.calendarMarker = this.manifDate;
  },
  async created() {
    await this.$accessor.configuration.fetch("eventDate");
    await this.fetchAvailabilities();
  },
  methods: {
    fetchAvailabilities() {
      if (!this.selectedVolunteer) return;
      return this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
        this.selectedVolunteer.id,
      );
    },
    isEndOfPeriod(hour: number): boolean {
      return isEndOfAvailabilityPeriod(hour);
    },
    isPartyShift(hour: number): boolean {
      return isPartyShift(hour);
    },
    togglePeriod(dateString: DateString, hour: number) {
      if (this.isReadonly) return;

      const { period } = AvailabilityDate.init({ date: dateString, hour });
      if (this.isSelected(dateString, hour)) return this.removePeriod(period);
      this.addPeriod(period);
    },
    addPeriod(period: Period) {
      this.$accessor.volunteerAvailability.addAvailabilityPeriod(period);
    },
    removePeriod(period: Period) {
      this.$accessor.volunteerAvailability.removeAvailabilityPeriod(period);
    },
  },
});
</script>

<style lang="scss" scoped>
.event {
  background-color: rgba(25, 118, 210, 0.2);
  width: 100%;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  user-select: none;
}

.read-only {
  cursor: default;
}

.one-hour {
  height: 100%;
}

.two-hours {
  height: 200%;
}

.selected {
  background-color: rgba(25, 118, 210, 1);
  color: white;
}

.is-error {
  background-color: red;
  color: white;
}

/* Hover only on computer but not with touchscreen */
@media (hover: hover) and (pointer: fine) {
  .event:hover:not(.read-only) {
    background-color: rgba(25, 118, 210, 0.8);
  }
}
</style>
