<template>
  <div v-if="!disabled" style="">
    <v-calendar
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

    <div style="display: flex; flex-direction: column">
      <v-btn text @click="addTimeframe">ajouter</v-btn>
      <v-btn text>ajouter toute la jounée</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: "TimeframeSelector",
  props: {
    disabled: {
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

    // calendar
    value: "",
    events: [],
    dragEvent: null,
    dragStart: null,
    createEvent: null,
    createStart: null,
    extendOriginal: null,
  }),
  computed: {},
  watch: {
    events: {
      deep: true,
      handler() {
        this.$emit("set-timeframes", this.events);
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
      if (event && timed) {
        this.dragEvent = event;
        this.dragTime = null;
        this.extendOriginal = null;
      }
    },
    startTime(tms) {
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
      this.createEvent = event;
      this.createStart = event.start;
      this.extendOriginal = event.end;
    },
    mouseMove(tms) {
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
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
    },
    cancelDrag() {
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
