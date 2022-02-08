<template>
  <div>
      <details-calendar
      :calendarEvents="events"
      >
      </details-calendar>
  </div>
</template>

<script>
import Vue from "vue";
import DetailsCalendar from '~/components/organisms/DetailsCalendar.vue';

export default Vue.extend({
  components: {
    DetailsCalendar
  },
  data() {
    return {
      events: [
        {
          name: "予定1",
          start: new Date(2020, 0, 1),
          end: new Date(2020, 0, 2)
        },
        {
          name: "予定2",
          start: new Date(2020, 0, 3),
          end: new Date(2020, 0, 4)
        },
        {
          name: "予定3",
          start: new Date(2020, 0, 5),
          end: new Date(2020, 0, 6)
        }
      ]
    };
  }

});
</script>

<style>

</style>