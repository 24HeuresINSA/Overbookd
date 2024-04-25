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
    <SearchTeams
      :value="excludedTeams"
      label="Exclure des équipes"
      class="filters__field"
      :boxed="false"
      @change="changeExcludedTeams"
    ></SearchTeams>

    <div class="friend_filter_categoy_sort">
      <div>
        <v-switch
          v-show="!isOrgaTaskMode"
          v-model="hasNoFriends"
          label="N'a aucun ami"
          class="filters__field"
          hide-details
          @change="changeNoFriends"
        ></v-switch>
        <p class="stats">
          Nombre de bénévoles dans la liste :
          <span class="font-weight-bold">{{ listLength }}</span>
        </p>
      </div>
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Team } from "~/utils/models/team.model";
import { nextSortDirection } from "~/utils/models/assignment.model";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import { isOrgaTaskMode } from "~/utils/assignment/mode";

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
    "change:excluded-teams",
    "change:sort",
    "change:has-no-friends",
  ],
  data: () => ({
    search: "",
    teams: [],
    excludedTeams: [],
    sort: 0,
    hasNoFriends: false,
  }),
  computed: {
    isOrgaTaskMode(): boolean {
      return isOrgaTaskMode(this.$route.path);
    },
  },
  methods: {
    changeSearch(search: string) {
      this.$emit("change:search", search);
    },
    changeTeams(teams: Team[]) {
      this.$emit("change:teams", teams);
    },
    changeExcludedTeams(excludedTeams: Team[]) {
      this.$emit("change:excluded-teams", excludedTeams);
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
  block-size: auto;
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

.sort__category {
  cursor: pointer;
  position: absolute;
  right: 0px;
  top: 0px;
}

.friend_filter_categoy_sort {
  width: 100%;
  gap: 5px;
  margin-bottom: 5px;
  display: block;
  position: relative;
}
</style>
