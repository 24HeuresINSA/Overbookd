<template>
  <v-data-table :headers="headers" :items="availableTimeSpans">
    <template #[`item.action`]="item">
      <v-btn text @click="selectUser(item)">sélectionner</v-btn>
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
          value: "name",
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
        {
          text: "action",
          value: "action",
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
    selectUser({ item }) {
      this.$emit("selected-task", item);
    },
  },
};
</script>

<style scoped></style>
