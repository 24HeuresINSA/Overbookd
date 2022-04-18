<template>
  <div style="width: 500px; height: 100%" @mouseleave="hoverTask({})">
    <v-simple-table dense fixed-header height="575">
      <template #default>
        <thead>
          <tr>
            <td>FT</td>
            <td>Debut</td>
            <td>Fin</td>
            <td>Requit</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(timeSpan, index) in availableTimeSpans"
            :key="index"
            @click="assignTask(timeSpan)"
            @mouseover="hoverTask(timeSpan)"
          >
            <td>{{ timeSpan.FTID }} - {{ timeSpan.FTName }}</td>
            <td>
              {{
                timeSpan
                  ? timeSpan.start.getHours() +
                    ":" +
                    timeSpan.start.getMinutes()
                  : ""
              }}
            </td>
            <td>
              {{
                timeSpan
                  ? timeSpan.end.getHours() + ":" + timeSpan.end.getMinutes()
                  : ""
              }}
            </td>
            <td>
              {{ timeSpan ? timeSpan.required : "" }}
            </td>
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

      headers: [
        {
          text: "FT",
          value: "FTID",
        },
        {
          text: "Date",
          value: "date",
        },
        {
          text: "Début",
          value: "start",
        },
        {
          text: "Fin",
          value: "end",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
      height: window.innerHeight * 0.75,
      snack: new Snack(),
    };
  },

  computed: {
    availableTimeSpans() {
      return this.$accessor.assignment.availableTimeSpans;
    },
    FTs() {
      return this.$accessor.assignment.FTs;
    },
  },

  methods: {
    async assignTask(task) {
      const res = await this.$accessor.assignment.assignUserToTimespan({
        userID: task._id,
        timespanID: this.$accessor.assignment.selectedUser._id,
      });
      if (!res) {
        this.snack.display(
          "Le créneau est déjà assigné, change d'utilisateur séléctionné pour recharger les créneaux"
        );
      }
    },
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
