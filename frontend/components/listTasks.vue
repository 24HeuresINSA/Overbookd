<template>
  <div
    style="width: 500px; height: 70vh; overflow: auto"
    @mouseleave="hoverTask({})"
  >
    <v-data-table
      :headers="[
        {
          text: 'FT',
          value: 'FTID',
        },
        {
          text: 'Date',
          value: 'start',
        },
        {
          text: 'Requit',
          value: 'required',
        },
      ]"
      :items="availableTimeSpans"
      class="elevation-1"
      hide-default-footer
      disable-pagination
      dense
    >
      <template #body="{ items }">
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="index"
            style="cursor: pointer"
            @click="assignTask(item)"
            @mouseover="hoverTask(item)"
          >
            <td>{{ item.FTID }} - {{ item.FTName }}</td>
            <td>
              {{ item.start.toLocaleString() }}
            </td>
            <td>
              {{ item ? item.required : "" }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
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
