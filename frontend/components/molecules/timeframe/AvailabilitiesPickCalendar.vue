<template>
  <div>
    <OverCalendarV2
      :date="period.start"
      :weekdays="getWeekdayNumbers(period)"
      :events="[]"
      class="no-scroll elevation-2"
    >
      <template #day-label-header="{ date }">
        <div class="day-header">
          <p>
            {{
              new Date(date).toLocaleDateString("fr-FR", { weekday: "short" })
            }}
          </p>
          <p>
            {{ new Date(date).toLocaleDateString("fr-FR", { day: "numeric" }) }}
          </p>
        </div>
      </template>
      <template #interval="{ date, time }">
        <div
          v-if="!dayEvent(time) || getHour(time) % 2 === 0"
          class="event"
          :class="{
            'two-hours': dayEvent(time),
            'one-hour': !dayEvent(time),
            selected: isSelected(date, time),
            locked: isLocked(date, time),
          }"
          @click="selectEvent(date, time)"
        >
          5
        </div>
      </template>
    </OverCalendarV2>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { Period } from "~/utils/models/period";
import { SHIFT_HOURS } from "~/utils/shift/shift";

export default Vue.extend({
  name: "AvailabilitiesPickCalendar",
  components: { OverCalendarV2 },
  props: {
    period: {
      type: Object as () => Period,
      required: true,
      default: () => ({
        start: new Date(),
        end: new Date(),
      }),
    },
  },
  data: () => ({
    selected: [] as Period[],
  }),
  computed: {
    lockedAvailabilities(): Period[] {
      return [];
    },
    isSelected(): (date: string, time: string) => boolean {
      return (date: string, time: string) => {
        const hour = this.getHour(time);
        const selected = this.selected.find(
          (event) =>
            event.start.getDate() === new Date(date).getDate() &&
            event.start.getHours() === hour
        );
        return selected !== undefined;
      };
    },
    isLocked(): (date: string, time: string) => boolean {
      return (date: string, time: string) => {
        const hour = this.getHour(time);
        const locked = this.lockedAvailabilities.find(
          (event) =>
            event.start.getDate() === new Date(date).getDate() &&
            event.start.getHours() === hour
        );
        return locked !== undefined;
      };
    },
  },
  methods: {
    getHour(time: string) {
      return parseInt(time.split(":")[0]);
    },
    dayEvent(time: string) {
      const hour = this.getHour(time);
      return hour >= SHIFT_HOURS.NIGHT && hour < SHIFT_HOURS.PARTY;
    },
    getWeekdayNumbers(period: Period): Number[] {
      const weekdays = [];
      for (
        let date = new Date(period.start);
        date <= period.end;
        date.setDate(date.getDate() + 1)
      ) {
        weekdays.push(date.getDay());
      }
      return weekdays;
    },
    selectEvent(date: string, time: string) {
      if (this.isSelected(date, time)) {
        this.selected = this.selected.filter(
          (event) =>
            event.start.getDate() !== new Date(date).getDate() ||
            event.start.getHours() !== this.getHour(time)
        );
        return;
      }
      const hour = this.getHour(time);
      let length = 1;
      if (this.dayEvent(time)) {
        length = 2;
      }
      this.selected.push({
        start: new Date(`${date} ${time}`),
        // commentaire de Shagasse
        end: new Date(new Date(`${date} ${time}`).setHours(hour + length)),
      });
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

.selected {
  background-color: rgba(25, 118, 210, 1);
  color: white;
}

.locked {
  background-color: rgba(76, 175, 80, 1);
  color: white;
}

/* Hover only on computer but not with touchscreen */
@media (hover: hover) and (pointer: fine) {
  .event:hover {
    background-color: rgba(25, 118, 210, 0.8);
  }
}

.one-hour {
  height: 100%;
}

.two-hours {
  height: 200%;
}

.day-header {
  min-height: 5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  p {
    margin: 0;
  }
}
</style>

<style lang="scss">
/* hide the scrollbar */
.no-scroll {
  .v-calendar-daily__head {
    margin-right: 0;
  }

  .v-calendar-daily__scroll-area {
    overflow: hidden;
  }
}
</style>
