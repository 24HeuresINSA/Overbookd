<template>
  <div style="flex-grow: 2; height: auto">
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.cal.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.cal.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>

    <v-calendar
      ref="cal"
      v-model="centralDay"
      :events="calendarFormattedEvents"
      color="primary"
      type="week"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      @mousedown:event="startDrag"
      @mousedown:time="startTime"
      @mousemove:time="mouseMove"
      @mouseup:time="endDrag"
      @mouseleave.native="cancelDrag"
    >
      <template #interval="{ date, time }">
        <div
          v-if="isUserAvailableInTimeframe(new Date(date + ' ' + time))"
          style="
            background-color: rgba(95, 219, 72, 0.45);
            height: 100%;
            width: 100%;
          "
        ></div>
      </template>
    </v-calendar>
  </div>
</template>

<script>
export default {
  name: "OverCalendar",
  props: ["events"],

  data() {
    return {
      // calendar drag and drop
      dragEvents: [],
      dragEvent: null,
      dragStart: null,
      createEvent: null,
      createStart: null,
      extendOriginal: null,

      newEvent: undefined,
      centralDay: this.$accessor.config.getConfig("event_date"),
    };
  },

  computed: {
    calendarFormattedEvents() {
      let res = [];
      if (this.selectedUser.assigned) {
        res = this.selectedUser.assigned;
      }
      if (this.newEvent) {
        res.push(this.newEvent);
      }
      return res;
    },
    selectedUser: function () {
      return this.$accessor.user.mUser;
    },
  },

  methods: {
    // calendar drag and drop
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
          name: `Créneau #${this.calendarFormattedEvents.length}`,
          start: this.createStart,
          end: this.createStart,
          timed: true,
        };
        this.newEvent = this.createEvent;
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
      console.log(this.calendarFormattedEvents);
      this.dragTime = null;
      this.dragEvent = null;
      this.createEvent = null;
      this.createStart = null;
      this.extendOriginal = null;
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
          // if (i !== -1) {
          //   this.events.splice(i, 1);
          // }
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

    getStupidAmericanTimeFormat(date) {
      date = new Date(date);
      return `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
    isUserAvailableInTimeframe(timeframe) {
      // timeframe date object
      const availabilities = this.events.filter((e) => !e.FTID);
      let isUserAvailableInTimeframe = false;
      availabilities.forEach((availability) => {
        if (availability.schedule) {
          let start = new Date(availability.schedule.start);
          let end = new Date(availability.schedule.end);
          if (
            start.getTime() <= timeframe.getTime() + 5000 &&
            end.getTime() >= timeframe.getTime() + 5000
          ) {
            isUserAvailableInTimeframe = true;
          }
        }
      });
      return isUserAvailableInTimeframe;
    },
  },
};
</script>

<style scoped></style>
