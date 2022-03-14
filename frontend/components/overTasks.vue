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

  methods: {
    addTask(task) {
      this.$emit(
        "add-task",
        {
          name: task.name,
          FTID: task.FTID,
          schedule: {
            start: new Date(task.schedule.start),
            end: new Date(task.schedule.end),
          },
        },
        this.FTs.find((FT) => FT._id === task.FTID)
      );
    },
  },
};
</script>

<style scoped></style>
