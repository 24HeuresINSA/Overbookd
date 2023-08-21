<template>
  <div class="calendar-list">
    <OverMultiCalendar
      v-model="date"
      :users="volunteers"
      :event-to-add="periodAsEvent"
      :planning-events="tasksAsEvents"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { IProvidePeriod } from '@overbookd/period';
import {
  PlanningEvent,
  convertTaskToPlanningEvent,
} from '~/domain/common/planning-events';
import OverMultiCalendar from '../calendar/OverMultiCalendar.vue';
import { CalendarUser } from '~/utils/models/calendar';

export default Vue.extend({
  name: 'CalendarList',
  components: { OverMultiCalendar },
  data: () => {
    return {
      date: new Date(),
    };
  },
  computed: {
    period(): IProvidePeriod {
      return this.$accessor.needHelp.period;
    },
    volunteers(): CalendarUser[] {
      return this.$accessor.needHelp.filteredVolunteers;
    },
    periodAsEvent(): PlanningEvent {
      const period = this.$accessor.needHelp.period;
      return {
        ...period,
        name: "Viens m'aider",
      };
    },
    tasksAsEvents(): PlanningEvent[] {
      return this.$accessor.needHelp.volunteers.flatMap(({ tasks, id }) =>
        tasks.map((task) => convertTaskToPlanningEvent(task, id))
      );
    },
  },
  watch: {
    period() {
      this.date = this.$accessor.needHelp.start;
    },
  },
  created() {
    this.date = this.$accessor.needHelp.start;
  },
});
</script>

<style lang="scss" scoped>
.calendar-list {
  overflow-y: scroll;
}
</style>
