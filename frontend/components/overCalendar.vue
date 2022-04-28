<template>
  <div style="flex-grow: 2; height: auto">
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.cal.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <div class="switch">
        <p :class="customClass('ot')">Orga-Tâche</p>
        <v-switch :value="mode" @change="changeMode"></v-switch>
        <p :class="customClass('to')">Tâche-Orga</p>
      </div>
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
        <div class="text-wrap" @click.right="popUp(event)" @contextmenu.prevent>
          <h3>{{ event.FTName }}</h3>
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
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      <h3>{{ snack.feedbackMessage }}</h3>
    </v-snackbar>
  </div>
</template>

<script>
import {Snack} from "~/utils/models/snack";

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
      snack: new Snack(),
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
          if (new Date(this.centralDay) < multipleSolidTask[0].start) {
            this.centralDay = multipleSolidTask[0].start;
          }
          if (
            new Date(this.centralDay) >
            multipleSolidTask[multipleSolidTask.length - 1].end
          ) {
            this.centralDay =
              multipleSolidTask[multipleSolidTask.length - 1].end;
          }

          multipleSolidTask.forEach((task) => {
            task["color"] = this.getDisplayColor(task);
            events.push(task);
          });
        }
      } else {
        let hoverTask = this.$accessor.assignment.hoverTask;
        for(const event of events) {
          if(!event.color) event["color"] = this.getDisplayColor(event);
          console.log(event);
        }
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
    selectedUser: function () {
      return this.$accessor.user.mUser;
    },
    mode() {
      return !this.$accessor.assignment.filters.isModeOrgaToTache;
    },
  },
  methods: {
    popUp(event) {
      this.$accessor.assignment.getUserAssignedToSameTimespan(event);
      this.$emit("open-unassign-dialog");
    },
    // calendar drag and drop
    async startDrag({ event }) {
      const isModeOrgaToTache =
        this.$accessor.assignment.filters.isModeOrgaToTache;
      await this.$accessor.assignment.selectTimeSpan(event);
      if (isModeOrgaToTache) {
        this.popUp(event);
      } else {
        this.centralDay = new Date(
          this.$accessor.assignment.selectedTimeSpan.start
        );
        this.$accessor.assignment
          .filterAvailableUserForTimeSpan(event)
          .then(() => {
            this.snack.display("Utilisateur chargé ✅");
          });
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
      this.$accessor.assignment.setMultipleSolidTask();
      this.events = [];

      this.$accessor.assignment.changeMode(!isMode);
      this.$accessor.assignment.initStore();
    },
    getDisplayColor(timespan) {
      let transparency = (0.2 + 0.8 * timespan.completion).toFixed(2);
      if(isNaN(transparency)) {
        transparency = 1.0;
      }
      if (timespan.required === "soft") {
        return "rgb(42,157,143," + transparency + ")";
      } else if (timespan.required === "hard") {
        return "rgb(150,150,0," + transparency + ")";
      } else if (timespan.required === "confiance") {
        return "rgba(209,105,224," + transparency + ")";
      }
    },
    customClass(mode) {
      if (mode == "ot") {
        return this.$accessor.assignment.filters.isModeOrgaToTache
          ? "selected"
          : "none";
      } else {
        return this.$accessor.assignment.filters.isModeOrgaToTache
          ? "none"
          : "selected";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.switch {
  display: flex;
  align-items: center;
  margin: auto;

  p {
    margin-right: 1vh;
    margin-top: 1.3vh;
    font-weight: 400;
    color: rgb(190, 190, 190);
  }

  .selected {
    color: rgb(0, 255, 0);
  }
}
</style>
