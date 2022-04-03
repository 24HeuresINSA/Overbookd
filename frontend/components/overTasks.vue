<template>
  <div>
    <v-card v-if="selectedUser">
      <v-card-text>
        <div style="display: flex">
          <v-text-field label="Recherche" style="padding: 2px"></v-text-field>
          <v-text-field label="Team" style="padding: 2px"></v-text-field>
        </div>
        <ListTasks></ListTasks>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// list tasks that are assigned to user and available tasks
import ListTasks from "./listTasks";

export default {
  name: "OverTasks",
  components: { ListTasks },

  data() {
    return {
      FTs: [],
    };
  },

  computed: {
    selectedUser() {
      return this.$accessor.assignment.selectedUser;
    },
  },

  methods: {},
};
</script>

<style scoped></style>
