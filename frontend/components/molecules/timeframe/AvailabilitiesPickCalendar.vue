<template>
  <div>
    <v-calendar
      ref="refCalendar"
      type="week"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      :weekday-format="() => ''"
      :start="start"
      :end="end"
      class="no-scroll"
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
          }"
          @click="selectEvent(date, time)"
        >
          5
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AvailabilitiesPickCalendar",
  props: {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    selected: [] as any[],
  }),
  computed: {
    isSelected() {
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
  },
  methods: {
    getHour(time: string) {
      return parseInt(time.split(":")[0]);
    },
    dayEvent(time: string) {
      const hour = this.getHour(time);
      return hour >= 6 && hour <= 19;
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
        end: new Date(`${date} ${time}`).setHours(hour + length),
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
}

.selected {
  background-color: rgba(25, 118, 210, 1);
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
