<template>
  <div>
    <v-card v-if="selectedUser">
      <v-card-text>
        <div style="display: flex">
          <v-text-field
            label="Recherche"
            style="padding: 2px"
            @input="updateFilters('search', $event)"
          />
          <TeamSearchField @input="updateFilters('team', $event)" />
        </div>
        <div class="content">
          <ListTasks class="task" />
          <p>Nombre de tache possible : {{ $accessor.assignment.availableTimeSpans.length }}</p>

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
import TeamSearchField from "./atoms/TeamSearchField.vue";

export default {
  name: "OverTasks",
  components: { ListTasks, CommentsDisplay, TeamSearchField },

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
    updateFilters(key, value) {
      this.$accessor.assignment.setFTFilter({ key, value });
    },
  },
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
