<template>
  <div style="width: 500px; height: 100%" @mouseleave="multipleHoverTask()">
    <v-simple-table dense fixed-header height="800">
      <template #default>
        <thead>
          <tr>
            <td>FT</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(ft, index) in FTs"
            :key="index"
            @click="multipleSolidTask(ft)"
            @mouseover="multipleHoverTask(ft)"
          >
            <td>{{ ft.count + " - " + ft.general.name }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      {{ snack.feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import { Snack } from "~/utils/models/snack";
import TimeSpanRepo from "~/repositories/timeSpanRepo";

export default {
  name: "ListTasks",

  data() {
    return {
      selectedTasksIndex: undefined,
      height: window.innerHeight * 0.75,
      snack: new Snack(),
    };
  },

  computed: {
    FTs() {
      const fts = this.$accessor.assignment.FTs.filter((item) => {
        if (item.general.name !== "" && item.status === "ready") {
          return item;
        }
      });
      return fts;
    },
  },

  methods: {
    async multipleHoverTask(ft) {
      if (ft) {
        const ftTimespans = await TimeSpanRepo.getTimeSpanByFTID(
          this,
          ft.count
        );
        const timespanCompletion =
          await TimeSpanRepo.getTotalNumberOfTimespansAndAssignedTimespansByFTID(
            this,
            ft.count
          );
        if (ftTimespans && timespanCompletion) {
          const tosend = ftTimespans.data.map((ts) => ({
            ...ts,
            start: new Date(ts.start),
            end: new Date(ts.end),
            timed: true,
            FTName: this.getFTName(
              ts,
              timespanCompletion.data,
              ft.general.name
            ),
          }));
          this.$accessor.assignment.setMultipleHoverTask(tosend);
        }
      } else {
        this.$accessor.assignment.setMultipleHoverTask([]);
      }
    },
    async multipleSolidTask(ft) {
      if (ft) {
        const ftTimespans = await TimeSpanRepo.getTimeSpanByFTID(
          this,
          ft.count
        );
        const timespanCompletion =
          await TimeSpanRepo.getTotalNumberOfTimespansAndAssignedTimespansByFTID(
            this,
            ft.count
          );
        if (ftTimespans && timespanCompletion) {
          let multipleSolidTask = this.$accessor.assignment.multipleSolidTask;
          if (multipleSolidTask.length > 0) {
            if (multipleSolidTask[0].FTName === ft.general.name) {
              this.$accessor.assignment.setMultipleSolidTask([]);
              return;
            }
          }
          const tosend = ftTimespans.data.map((ts) => ({
            ...ts,
            start: new Date(ts.start),
            end: new Date(ts.end),
            timed: true,
            FTName: this.getFTName(
              ts,
              timespanCompletion.data,
              ft.general.name
            ),
          }));
          this.$accessor.assignment.setMultipleSolidTask(tosend);
        }
      }
    },
    getFTName(timespan, timespanCompletion, name) {
      let ret = { assigned: 0, total: 0 };
      this.$accessor.assignment.timespans
        .filter(
          (ts) =>
            ts.FTID === timespan.FTID &&
            ts.start.toString() === new Date(timespan.start).toString() &&
            ts.end.toString() === new Date(timespan.end).toString() &&
            ts.required === timespan.required
        )
        .forEach((ts) => {
          ret.assigned += timespanCompletion[ts._id].assigned;
          ret.total += timespanCompletion[ts._id].total;
        });
      return "[" + ret.assigned + "/" + ret.total + "] " + name;
    },
  },
};
</script>

<style scoped></style>
