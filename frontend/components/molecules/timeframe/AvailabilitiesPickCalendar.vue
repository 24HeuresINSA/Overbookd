<template>
  <div>
    <v-calendar
      ref="refCalendar"
      type="week"
      :short-weekdays="false"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      :events="events"
      :event-ripple="false"
      :start="start"
      :end="end"
      color="primary"
      class="elevation-1"
      @click:event="activeEvent"
      @mouseover:event="hoverEvent"
      @mouseleave:event="leaveEvent"
    ></v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

interface CalendarTimeWindow {
  start: Date;
  end: Date;
  color: string;
  name: string;
  timed: boolean;
  active: boolean;
  hover: boolean;
}

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
    events: [] as CalendarTimeWindow[],
  }),
  async mounted() {
    this.initEvents();
  },
  methods: {
    initEvents() {
      let currentDate = new Date(this.start);
      currentDate.setHours(0);
      currentDate.setMinutes(0);

      let endDate = new Date(this.end);
      while (currentDate < endDate) {
        let event: CalendarTimeWindow = {
          start: currentDate,
          end: new Date(currentDate),
          color: "rgba(25,118,210,0.20)",
          name: "Créneau",
          timed: true,
          active: false,
          hover: false,
        };
        event.end.setHours(event.end.getHours() + 2);
        this.events.push(event);
        currentDate = event.end;
      }
      console.log(this.events);
    },
    activeEvent({ event }: { event: CalendarTimeWindow }) {
      event.active = !event.active;
      if (!event.active) {
        console.log("desactive");
        event.color = "rgba(25,118,210,0.20)";
        return;
      }
      console.log("active");
      event.color = "primary";
      event.hover = false;
    },
    hoverEvent({ event }: { event: CalendarTimeWindow }) {
      if (event.hover || event.active) return;
      console.log("hover");
      event.color = "primary";
      event.hover = true;
    },
    leaveEvent({ event }: { event: CalendarTimeWindow }) {
      if (!event.hover || event.active) return;
      console.log("leave");
      event.color = "rgba(25,118,210,0.20)";
      event.hover = false;
    },
  },
});
</script>
