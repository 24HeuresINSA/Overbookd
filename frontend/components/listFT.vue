<template>
  <div style="width: 500px; height: 100%" @mouseleave="hoverTask({})">
    <v-simple-table dense fixed-header height="800">
      <template #default>
        <thead>
          <tr>
            <td>FT</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ft, index) in FTs" :key="index">
            <td>{{ ft.general.name }}</td>
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
      const fts = this.$accessor.assignment.FTs.filter(
        (item) => item.general.name !== ""
      );
      return fts;
    },
  },

  methods: {
    resolveFTName(FTID) {
      const FT = this.FTs.find((FT) => FT.count === FTID);
      if (FT) {
        return FT.general.name;
      }
      return FTID;
    },
    hoverTask(timespan) {
      this.$accessor.assignment.setHoverTask(timespan);
    },
  },
};
</script>

<style scoped></style>
