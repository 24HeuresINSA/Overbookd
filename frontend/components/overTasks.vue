<template>
  <div>
    <v-card v-if="selectedUser">
      <v-card-title
        >{{ selectedUser.firstname }}.{{ selectedUser.lastname }}</v-card-title
      >
      <v-card-text>
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
