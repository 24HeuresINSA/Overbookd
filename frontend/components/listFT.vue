<template>
  <div style="width: 500px; height: 100%">
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
            @click="getFtTimeSpans(ft)"
            @mouseover="multipleHoverTask(ft)"
          >
            <td>{{ "[" + ft.count + "] " + ft.general.name }}</td>
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
    async getFtTimeSpans(ft) {
      const ftTimespans = await TimeSpanRepo.getTimeSpanByFTID(this, ft.count);
      return ftTimespans;
    },
    async multipleHoverTask(ft) {
      const ftTimespans = await TimeSpanRepo.getTimeSpanByFTID(this, ft.count);
      if (ftTimespans) {
        this.$assignment.setMultipleHoverTask(ftTimespans);
      }
    },
  },
};
</script>

<style scoped></style>
