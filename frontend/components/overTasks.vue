<template>
  <div>
    <v-card v-if="selectedUser">
      <v-card-text>
        <div style="display: flex">
          <v-text-field label="Recherche" style="padding: 2px"></v-text-field>
          <v-text-field label="Team" style="padding: 2px"></v-text-field>
        </div>
        <div class="content">
          <ListTasks class="task" />
          <CommentsDisplay class="comment" />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
// list tasks that are assigned to user and available tasks
import ListTasks from "./listTasks";
import CommentsDisplay from "./molecules/commentsDisplay.vue";

export default {
  name: "OverTasks",
  components: { ListTasks, CommentsDisplay },

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

<style scoped lang="scss">
.content {
  display: grid;
  .task {
    grid-row: 1;
  }
  .comment {
    margin-top: 1vh;
    grid-row: 2;
  }
}
</style>
