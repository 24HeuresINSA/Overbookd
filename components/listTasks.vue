<template>
  <v-data-table :headers="headers" :items="tasks">
    <template v-slot:item.action="item">
      <v-btn @click="selectUser(item)" text>sélectionner</v-btn>
    </template>

    <template v-slot:item.date="row">
      {{ new Date(row.item.schedule.start).toLocaleDateString() }}
    </template>

    <template v-slot:item.start="row">
      {{ new Date(row.item.schedule.start).toLocaleTimeString() }}
    </template>

    <template v-slot:item.end="row">
      {{ new Date(row.item.schedule.end).toLocaleTimeString() }}
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: "listTasks",

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

  methods: {
    selectUser({item}) {
      this.$emit("selected-task", item);
    },
  },
};
</script>

<style scoped></style>
