<template>
  <div style="">
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.FormCalendar.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.FormCalendar.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-calendar
      ref="FormCalendar"
      v-model="value"
      type="week"
      color="primary"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      :events="events"
      :event-ripple="false"
      @mousedown:event="startDrag"
      @mousedown:time="startTime"
      @mousemove:time="mouseMove"
      @mouseup:time="endDrag"
      @mouseleave.native="cancelDrag"
    ></v-calendar>
  </div>
</template>

<script>
export default {
  name: "TimeframeSelector",
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default() {
        return false;
      },
    },
    complete: {
      type: Boolean,
      default() {
        return false;
      },
    },
    store: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data: () => ({
    possibleTimeframes: [],
    mTimeframe: {
      date: undefined,
      start: undefined,
      end: undefined,
    },
    eventDate: undefined,
    requiredDialog: false,
    selectedEvent: null,

    // calendar
    value: "",
    events: [],
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
  }),
  computed: {
    timeframes: function () {
      return this.store.timeframes;
    },
  },
  watch: {
    timeframes: {
      deep: true,
      handler() {
        this.events = [...this.timeframes];
      },
    },
  },
  mounted() {
    this.value = this.$accessor.config.getConfig("event_date");
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        this.possibleTimeframes.push({
          text: `${hour.toString().padStart(2, "0")}:${minute
            .toString()
            .padStart(2, "0")}`,
          time: {
            hour,
            minute,
          },
        });
      }
    }
  },
  methods: {
    // calendar
    startDrag({ event, timed }) {
      if (this.disabled) {
        return;
      }

      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    startTime(tms) {
      if (this.disabled) {
        return;
      }
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;

        this.dragTime = mouse - start;
      } else {
        this.createStart = this.roundTime(mouse);
        this.createEvent = {
          name: `Créneau #${this.events.length}`,
          start: this.createStart,
          end: this.createStart,
          timed: true,
        };

        this.events.push(this.createEvent);
      }
    },
    extendBottom(event) {
      if (this.disabled) {
        return;
      }
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms) {
      if (this.disabled) {
        return;
      }
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime !== null) {
        const start = this.dragEvent.start;
        const end = this.dragEvent.end;
        const duration = end - start;
        const newStartTime = mouse - this.dragTime;
        const newStart = this.roundTime(newStartTime);
        const newEnd = newStart + duration;

        this.dragEvent.start = newStart;
        this.dragEvent.end = newEnd;
      } else if (this.createEvent && this.createStart !== null) {
        const mouseRounded = this.roundTime(mouse, false);
        const min = Math.min(mouseRounded, this.createStart);
        const max = Math.max(mouseRounded, this.createStart);

        this.createEvent.start = min;
        this.createEvent.end = max;
      }
    },
    endDrag() {
      if (this.disabled) {
        return;
      }
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
      this.$emit("set-timeframes", this.events);
    },
    cancelDrag() {
      if (this.disabled) {
        return;
      }
      if (this.createEvent) {
        if (this.extendOriginal) {
          this.createEvent.end = this.extendOriginal;
        } else {
          const i = this.events.indexOf(this.createEvent);
          if (i !== -1) {
            this.events.splice(i, 1);
          }
        }
      }

      this.createEvent = null;
      this.createStart = null;
      this.dragTime = null;
      this.dragEvent = null;
    },
    roundTime(time, down = true) {
      const roundTo = 15; // minutes
      const roundDownTime = roundTo * 60 * 1000;

      return down
        ? time - (time % roundDownTime)
        : time + (roundDownTime - (time % roundDownTime));
    },
    toTime(tms) {
      return new Date(
        tms.year,
        tms.month - 1,
        tms.day,
        tms.hour,
        tms.minute
      ).getTime();
    },

    addTimeframe() {
      const timeframe = {
        start: new Date(this.mTimeframe.date),
        end: new Date(this.mTimeframe.date),
      };
      timeframe.start.setHours(this.mTimeframe.start.hour);
      timeframe.start.setMinutes(this.mTimeframe.start.minute);
      timeframe.end.setHours(this.mTimeframe.end.hour);
      timeframe.end.setMinutes(this.mTimeframe.end.minute);

      this.$emit("add-timeframe", timeframe);

      this.mTimeframe = {
        date: this.$accessor.config.getConfig("event_date"),
        start: undefined,
        end: undefined,
      };
    },
    addFullDay() {
      const timeframe = {
        start: new Date(this.mTimeframe.date),
        end: new Date(this.mTimeframe.date),
      };
      timeframe.end.setDate(timeframe.end.getDate() + 1);

      this.$emit("add-timeframe", timeframe);
      this.mTimeframe = {
        date: this.$accessor.config.getConfig("event_date"),
        start: undefined,
        end: undefined,
      };
    },
  },
};
</script>

<style scoped></style>
