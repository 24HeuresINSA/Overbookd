<template>
  <div class="filters">
    <v-text-field
      :value="search"
      class="filters__field"
      label="Recherche"
      @input="changeSearch"
    ></v-text-field>
    <SearchTeams
      :value="teams"
      class="filters__field"
      :boxed="false"
      @change="changeTeams"
    ></SearchTeams>

    <div class="friend_filter_categoy_sort">
      <v-switch
        v-model="hasNoFriends"
        label="N'a pas d'amis"
        class="filters__field"
        hide-details
        @change="changeNoFriends"
      ></v-switch>
      <div class="sort__category" @click="updateSort">
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-icon v-if="!sort" v-bind="attrs" v-on="on"> mdi-sort </v-icon>
            <v-icon v-else-if="sort > 0" v-bind="attrs" v-on="on">
              mdi-sort-ascending
            </v-icon>
            <v-icon v-else v-bind="attrs" v-on="on">
              mdi-sort-descending
            </v-icon>
          </template>
          <span>Trier par tache</span>
        </v-tooltip>
      </div>
    </div>
    <p class="stats">
      Nombre de bénévoles dans la liste :
      <span class="font-weight-bold">{{ listLength }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Team } from "~/utils/models/team.model";
import { nextSortDirection } from "~/utils/models/assignment.model";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";

export default defineComponent({
  name: "VolunteerFilters",
  components: { SearchTeams },
  props: {
    type: {
      type: String,
      required: false,
      default: "volunteer",
    },
    listLength: {
      type: Number,
      default: 0,
    },
  },
  emits: [
    "change:search",
    "change:teams",
    "change:sort",
    "change:has-no-friends",
  ],
  data: () => ({
    search: "",
    teams: [],
    sort: 0,
    hasNoFriends: false,
  }),
  methods: {
    changeSearch(search: string) {
      this.$emit("change:search", search);
    },
    changeTeams(teams: Team[]) {
      this.$emit("change:teams", teams);
    },
    updateSort() {
      this.sort = nextSortDirection(this.sort);
      this.$emit("change:sort", this.sort);
    },
    changeNoFriends() {
      this.$emit("change:has-no-friends", this.hasNoFriends);
    },
  },
});
</script>

<style lang="scss" scoped>
.filters {
  width: 100%;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  padding: 0 25px;

  &__field {
    width: 100%;
    padding-top: 0;
    margin-top: 0;
  }
}

.stats {
  margin-bottom: 5px;
}

.sort__category:hover {
  cursor: pointer;
}

.friend_filter_categoy_sort {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 5px;
}
</style>
