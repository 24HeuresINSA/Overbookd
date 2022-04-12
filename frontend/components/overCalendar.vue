<template>
  <div style="flex-grow: 2; height: auto">
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.cal.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-switch
        label="mode tache-orga"
        :value="mode"
        @change="changeMode"
      ></v-switch>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.cal.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>

    <v-calendar
      ref="cal"
      v-model="centralDay"
      :events="assignedTimeSlots"
      type="week"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      @mousedown:event="startDrag"
      @mousedown:time="startTime"
      @mousemove:time="mouseMove"
    >
      <template #event="{ event }">
        <div class="text-wrap">
          <strong>{{ event.FTName }}</strong>
        </div>
      </template>
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
    assignedTimeSlots() {
      let events = [...this.$accessor.assignment.assignedTimespans];
      if (this.mode) {
        events = [];
        let multipleSolidTask = this.$accessor.assignment.multipleSolidTask;
        if (multipleSolidTask.length > 0) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.centralDay = multipleSolidTask[0].start;
          multipleSolidTask.forEach((task) => {
            task["color"] = this.getDisplayColor(task);
            events.push(task);
          });
        }
      } else {
        let hoverTask = this.$accessor.assignment.hoverTask;
        if (hoverTask.FTID) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.centralDay = hoverTask.start;
          hoverTask["color"] = "rgba(204,51,255,0.50)";
          events.push(hoverTask);
        }
      }
      return events;
    },
    FTs() {
      return this.$accessor.assignment.FTs;
    },
    // eslint-disable-next-line vue/return-in-computed-property
    calendarFormattedEvents() {},
    selectedUser: function () {
      return this.$accessor.user.mUser;
    },
    mode() {
      return !this.$accessor.assignment.filters.isModeOrgaToTache;
    },
  },
  methods: {
    // calendar drag and drop
    startDrag({ event, timed }) {
      const isModeOrgaToTache =
        this.$accessor.assignment.filters.isModeOrgaToTache;
      this.$accessor.assignment.selectTimeSpan(event);
      if (isModeOrgaToTache) {
        this.$accessor.assignment.getUserAssignedToSameTimespan(event);
        this.$emit("open-unassign-dialog");
      } else {
        this.$accessor.assignment.filterAvailableUserForTimeSpan(event);
      }
    },
    startTime(tms) {
      const mouse = this.toTime(tms);

      if (this.dragEvent && this.dragTime === null) {
        const start = this.dragEvent.start;

        this.dragTime = mouse - start;
      }
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
      if (!this.mode) {
        // timeframe date object
        const availabilities =
          this.$accessor.assignment.selectedUserAvailabilities;
        let isUserAvailableInTimeframe = false;
        availabilities.forEach((availability) => {
          if (availability && availability.timeFrame) {
            let start = new Date(availability.timeFrame.start);
            let end = new Date(availability.timeFrame.end);
            if (
              start.getTime() <= timeframe.getTime() + 5000 &&
              end.getTime() >= timeframe.getTime() + 5000
            ) {
              isUserAvailableInTimeframe = true;
            }
          }
        });
        return isUserAvailableInTimeframe;
      } else {
        return false;
      }
    },
    changeMode(isMode) {
      //Security in case of locked hover
      this.$accessor.assignment.setHoverTask({});
      this.$accessor.assignment.setMultipleSolidTask([]);

      this.$accessor.assignment.changeMode(!isMode);
      this.$accessor.assignment.initStore();
    },
    getDisplayColor(timespan) {
      if (timespan.required === "soft") {
        return "rgba(0,255,0,0.75)";
      } else if (timespan.required === "hard") {
        return "rgba(200,0,125,0.75)";
      } else if (timespan.required === "confiance") {
        return "rgba(0,0,255,0.75)";
      }
    },
  },
};
</script>

<style scoped></style>
