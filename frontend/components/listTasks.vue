<template>
  <v-data-table
    :headers="headers"
    :items="availableTimeSpans"
    @click:row="assignTask"
  >
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
  },

  methods: {
    assignTask(task) {
      console.log(task);
    },
  },
};
</script>

<style scoped></style>
