<template>
  <div>
    <div class="d-flex">
      <v-list-item-title style="font-weight: bold; font-size: 25px"
      >{{ title }}
      </v-list-item-title>
      <v-switch
          v-model="showCalendar"
          label="Voir son planning"
          @change="generateEvents"
      ></v-switch>
    </div>
    <div v-if="showCalendar">
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
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ShowCalendar",
  props: ["title", "slots"],
  data() {
    return {
      showCalendar: false,
      selectedDate: "2022-05-22",
      events: [],
    };
  },
  methods: {
    generateEvents() {
      if (this.events.length === 0) {
        this.slots.forEach((timeslot) => {
          this.events.push({
            name: timeslot.name,
            start: this.getFormattedDate(new Date(timeslot.start)),
            end: this.getFormattedDate(new Date(timeslot.end)),
            color: this.getColor(timeslot.status),
          });
        });
      }
    },
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
  },
};
</script>

<style scoped></style>
