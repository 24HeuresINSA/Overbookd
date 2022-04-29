<template>
  <div>
    <v-card v-if="selectedUser">
      <v-card-text>
        <div style="display: flex">
          <v-text-field
            label="Recherche"
            style="padding: 2px"
            @input="updateFilters('search', $event)"
          ></v-text-field>
          <TeamSearchField
            @input="updateFilters('team', $event)"
          ></TeamSearchField>
          <v-switch
            label="ft non-complète"
            dense
            :input-value="true"
            @change="updateFilters('areAssignedFTsDisplayed', $event)"
          />
        </div>
        <div class="content">
          <ListFT class="ft" />
          <CommentsDisplay class="comment" />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import ListFT from "./listFT.vue";
import TeamSearchField from "./atoms/TeamSearchField.vue";
import CommentsDisplay from "./molecules/commentsDisplay.vue";

export default {
  name: "OverTasks",
  components: { ListFT, TeamSearchField, CommentsDisplay },

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
