<template>
  <div class="myCal">
    <v-sheet tile height="54" class="d-flex">
      <v-btn icon class="ma-2" @click="$refs.cal.prev()">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <h2 style="margin-top: 2%">
        {{
          new Date(calendarValue).toLocaleDateString("fr-fr", {
            month: "long",
            year: "numeric",
          })
        }}
      </h2>
      <v-spacer></v-spacer>
      <v-btn icon class="ma-2" @click="$refs.cal.next()">
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </v-sheet>
    <v-calendar
      ref="cal"
      v-model="calendarValue"
      color="primary"
      type="week"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    >
      <template #interval="{ date, time }">
        <div
          v-if="isUserAvailableInTimeframe(new Date(date + ' ' + time))"
          style="
            background-color: rgba(95, 219, 72, 0.45);
            height: 100%;
            width: 100%;
          "
        />
      </template>
    </v-calendar>
  </div>
</template>

<script>
import timeslotRepo from "~/repositories/timeslotRepo.ts";

export default {
  name: "AvailabilitiesCalendar",
  props: {
    mUser: {
      type: Object,
      default: () => undefined,
    },
  },
  data: () => {
    return {
      calendarValue: "",
      allTimeSlots: [],
    };
  },
  async mounted() {
    this.calendarValue = this.$accessor.config.getConfig("event_date");
    //to get all timeslots from the DB
    timeslotRepo.getAll(this).then((res) => {
      this.allTimeSlots = res.data;
    });
  },
  methods: {
    isUserAvailableInTimeframe(timeframe) {
      let isUserAvailableInTimeframe = false;
      if (this.mUser) {
        // timeframe date object
        const availabilities = this.mUser.availabilities;
        availabilities.forEach((availability) => {
          let slot = this.allTimeSlots.find((el) => el._id == availability);
          if (slot) {
            let start = new Date(slot.timeFrame.start);
            let end = new Date(slot.timeFrame.end);
            if (
              start.getTime() <= timeframe.getTime() + 5000 &&
              end.getTime() >= timeframe.getTime() + 5000
            ) {
              isUserAvailableInTimeframe = true;
            }
          }
        });
      }
      return isUserAvailableInTimeframe;
    },
  },
};
</script>

<style>
.myCal {
  padding-bottom: 10%;
  margin-left: 2.5%;
  margin-right: 2.5%;
}
</style>
