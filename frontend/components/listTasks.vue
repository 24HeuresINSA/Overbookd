<template>
  <v-data-table
    :headers="headers"
    :items="availableTimeSpans"
    @click:row="assignTask"
  >
    <template #[`item.timeframeID`]="{item}">
      {{ timespanToFTName[item.timeframeID] }}
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
          value: "timeframeID",
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
    timespanToFTName() {
      return this.$accessor.assignment.timespanToFTName;
    },
  },

  methods: {
    assignTask(task) {
      console.log("assignTask", task);
    },
    async resolveFTName(task) {
      const res = await  this.$accessor.assignment.getFTNameById(
        task.item.timeframeID
      );
      return res;
    },
  },
};
</script>

<style scoped></style>
