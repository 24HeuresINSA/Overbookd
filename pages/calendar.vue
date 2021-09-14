<template>
  <v-container>
    <v-calendar
      ref="calendar"
      :value="selectedDay"
      :events="userEvents"
      color="primary"
      type="week"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    ></v-calendar>
    <v-date-picker v-model="selectedDay"></v-date-picker>
  </v-container>
</template>

<script>
import { getUser } from "../common/role";

export default {
  name: "calendar",

  data() {
    return {
      selectedDay: undefined,
      userEvents: [],
    };
  },

  mounted() {
    const user = getUser(this);
    if (user.assigned) {
      user.assigned.forEach((assignedFT) => {
        let start = new Date(
          Date.parse(assignedFT.schedule.date + " " + assignedFT.schedule.start)
        );
        let end = new Date(
          Date.parse(assignedFT.schedule.date + " " + assignedFT.schedule.end)
        );
        this.userEvents.push({
          name: assignedFT.name,
          start: this.getStupidAmericanTimeFormat(start),
          end: this.getStupidAmericanTimeFormat(end),
          color: "#ebc034",
        });
      });
    }
  },

  methods: {
    getStupidAmericanTimeFormat(date) {
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    },
  },
};
</script>

<style scoped></style>
