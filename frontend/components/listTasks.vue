<template>
  <v-data-table
    :headers="headers"
    :items="availableTimeSpans"
    @click:row="assignTask"
  >
    <template #[`item.FTID`]="{ item }">
      {{ item.FTName || item.FTID }}
    </template>
    <template #[`item.date`]="row">
      {{ new Date(row.item.start).toLocaleDateString() }}
    </template>

    <template #[`item.start`]="row">
      {{ new Date(row.item.start).toLocaleTimeString() }}
    </template>

    <template #[`item.end`]="row">
      {{ new Date(row.item.end).toLocaleTimeString() }}
    </template>
  </v-data-table>
</template>

<script>
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
    assignTask(task) {
      this.$accessor.assignment.assignUserToTimespan({
        userID: task._id,
        timespanID: this.$accessor.assignment.selectedUser._id,
      });
    },
    resolveFTName(FTID) {
      const FT = this.FTs.find((FT) => FT.count === FTID);
      if (FT) {
        return FT.general.name;
      }
      return FTID;
    },
  },
};
</script>

<style scoped></style>
