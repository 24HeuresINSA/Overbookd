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
          @click="toggleAvailability(date, hour)"
        ></div>
      </template>
    </OverCalendar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { DateString, Hour, OverDate, Period } from "@overbookd/period";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import {
  Availabilities,
  AvailabilityDate,
  InitOverDate,
} from "@overbookd/volunteer-availability";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import { isEndOfAvailabilityPeriod } from "~/utils/availabilities/availabilities";
import { formatDateWithExplicitMonth } from "~/utils/date/date.utils";
import { isPartyShift } from "~/utils/shift/shift";
import {
  SavedCharismaPeriod,
  getPeriodCharisma,
} from "~/utils/models/charisma-period.model";

type AvailabilitiesSumupData = {
  calendarMarker: Date;
  availabilitiesAggregate: Availabilities;
  charismaDelta: number;
};

export default defineComponent({
  name: "AvailabilitiesSumup",
  components: { OverCalendar },
  props: {
    availabilities: {
      type: Array as () => Period[],
      default: () => [],
    },
    readonly: {
      type: Boolean,
      default: true,
    },
  },
  data: (): AvailabilitiesSumupData => ({
    calendarMarker: new Date(),
    availabilitiesAggregate: Availabilities.init(),
    charismaDelta: 0,
  }),
  computed: {
    charismaPeriods(): SavedCharismaPeriod[] {
      return this.$accessor.charismaPeriod.charismaPeriods ?? [];
    },
    selectedAvailabilities() {
      return this.availabilitiesAggregate.list;
    },
    errors() {
      return this.availabilitiesAggregate.errors;
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
    calendarTitle(): string {
      return formatDateWithExplicitMonth(this.calendarMarker);
    },
    isSelected(): (date: DateString, hour: Hour) => boolean {
      return (date: DateString, hour: Hour) => {
        const { period } = OverDate.init({ date, hour });
        return this.selectedAvailabilities.some((availability) =>
          availability.includes(period),
        );
      };
    },
    hasError(): (date: DateString, hour: Hour) => boolean {
      return (date: DateString, hour: Hour) => {
        const start = OverDate.init({ date, hour }).date;
        return this.errors.some(({ period }) => period.isIncluding(start));
      };
    },
    isReadonly(): boolean {
      return !this.$accessor.user.can(AFFECT_VOLUNTEER) || this.readonly;
    },
  },
  watch: {
    availabilities(availabilities: Period[]) {
      this.initAvailabilityState(availabilities);
    },
  },
  mounted() {
    this.calendarMarker = this.manifDate;
    this.initAvailabilityState(this.availabilities);
  },
  async created() {
    await Promise.all([
      this.$accessor.configuration.fetch("eventDate"),
      this.$accessor.charismaPeriod.fetchCharismaPeriods(),
    ]);
  },
  methods: {
    initAvailabilityState(availabilities: Period[]) {
      const selected = this.readonly ? [] : availabilities;
      const recorded = this.readonly ? availabilities : [];
      this.availabilitiesAggregate = Availabilities.init({
        selected,
        recorded,
      });
      this.charismaDelta = 0;
    },
    isEndOfPeriod(hour: Hour): boolean {
      return isEndOfAvailabilityPeriod(hour);
    },
    isPartyShift(hour: Hour): boolean {
      return isPartyShift(hour);
    },
    toggleAvailability(dateString: DateString, hour: Hour) {
      if (this.isReadonly) return;

      const selection = { date: dateString, hour };
      if (this.isSelected(dateString, hour)) {
        return this.unSelectAvailability(selection);
      }
      this.selectAvailability(selection);
    },
    selectAvailability(date: InitOverDate) {
      this.availabilitiesAggregate = this.availabilitiesAggregate.select(date);
      const charisma = this.getAssociatedCharisma(date);
      this.charismaDelta += charisma;
    },
    unSelectAvailability(date: InitOverDate) {
      this.availabilitiesAggregate =
        this.availabilitiesAggregate.unselect(date);
      const charisma = this.getAssociatedCharisma(date);
      this.charismaDelta -= charisma;
    },
    getAssociatedCharisma(date: InitOverDate): number {
      const { period } = AvailabilityDate.init(date);
      return getPeriodCharisma(this.charismaPeriods, period);
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
