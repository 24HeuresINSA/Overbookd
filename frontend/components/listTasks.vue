<template>
  <v-data-table
    :headers="headers"
    :items="availableTimeSpans"
    @click:row="assignTask"
  >
    <template #[`item.FTID`]="{item}">
      {{ item.FTID }}
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
          text: "date",
          value: "date",
        },
        {
          text: "début",
          value: "start",
        },
        {
          text: "fin",
          value: "end",
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
        timespanID: this.$accessor.assignment.selectedUser._id
      });
    },
    resolveFTName(FTID) {
      return this.FTs.find((FT) => FT.count === FTID)?.general.name;
    },
  },

  created() {
    console.log("ListTasks created");
    console.log(this.resolveFTName(12));
  },
};
</script>

<style scoped></style>
