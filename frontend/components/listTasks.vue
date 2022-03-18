<template>
  <v-data-table :headers="headers" :items="tasks">
    <template #[`item.action`]="item">
      <v-btn text @click="selectUser(item)">sélectionner</v-btn>
    </template>

    <template #[`item.date`]="row">
      {{ new Date(row.item.schedule.start).toLocaleDateString() }}
    </template>

    <template #[`item.start`]="row">
      {{ new Date(row.item.schedule.start).toLocaleTimeString() }}
    </template>

    <template #[`item.end`]="row">
      {{ new Date(row.item.schedule.end).toLocaleTimeString() }}
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "ListTasks",

  props: ["tasks"],

  data() {
    return {
      selectedTasksIndex: undefined,

      headers: [
        {
          text: "FT",
          value: "name",
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

  methods: {
    selectUser({ item }) {
      this.$emit("selected-task", item);
    },
  },
};
</script>

<style scoped></style>
