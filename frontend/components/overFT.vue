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
        </div>
        <ListFT />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import ListFT from "./listFT.vue";
import TeamSearchField from "./atoms/TeamSearchField.vue";
export default {
  name: "OverTasks",
  components: { ListFT, TeamSearchField },

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

<style scoped></style>
