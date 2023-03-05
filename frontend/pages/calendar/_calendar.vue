<template>
  <div>
    <div
      v-if="user !== undefined"
      class="w-full d-flex justify-center align-center"
    >
      <h1>{{ user.firstname }} {{ user.lastname }}</h1>
      <div class="ml-2">
        <OverChips :roles="user.team"></OverChips>
      </div>
    </div>
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
      v-model="selectedDate"
      color="primary"
      type="week"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      :events="events"
    >
      <template #event="{ event }">
        <div class="text-wrap">
          <h3>[{{ event.count }}]{{ event.name }}</h3>
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
      {{ snack.feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import { RepoFactory } from "~/repositories/repoFactory";
import { Snack } from "~/utils/models/snack";
import OverChips from "~/components/atoms/OverChips";

export default {
  name: "Calendar",
  components: {
    OverChips,
  },
  data: function () {
    return {
      userId: this.$route.params.calendar,
      events: [],
      selectedDate: "2022-05-22",
      user: undefined,
      allTimeSlots: [],
      snack: new Snack(),
    };
  },
  created() {
    RepoFactory.userRepo.getUser(this, this.userId).then((res) => {
      this.user = res.data;
    });
    RepoFactory.timeslotRepo.getAll(this).then((res) => {
      this.allTimeSlots = res.data;
    });
    RepoFactory.ftRepo.myPlanning(this, this.userId).then((res) => {
      let slots = res.data[0].slots;
      slots.forEach((timeslot) => {
        this.events.push({
          name: timeslot.name,
          start: this.getFormattedDate(new Date(timeslot.start)),
          end: this.getFormattedDate(new Date(timeslot.end)),
          color: this.getColor(timeslot.status),
          count: timeslot.count,
        });
      });
      this.snack.display("Planning chargé ✅");
    });
  },
  methods: {
    getFormattedDate(date) {
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const year = date.getFullYear();
      const hour = ("0" + date.getHours()).slice(-2);
      const min = ("0" + date.getMinutes()).slice(-2);
      const seg = ("0" + date.getSeconds()).slice(-2);
      return (
        year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seg
      );
    },
    getColor(type) {
      switch (type) {
        case "refused":
          return "red";
        case "submitted":
          return "orange";
        case "draft":
          return "grey";
        case "validated":
          return "success";
        case "affected":
          return "deep-purple";
        default:
          return "grey";
      }
    },
    isUserAvailableInTimeframe(timeframe) {
      let isUserAvailableInTimeframe = false;
      if (this.user) {
        // timeframe date object
        const availabilities = this.user.availabilities;
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

<style scoped></style>
