<template>
  <div class="filters">
    <v-text-field
      :value="search"
      class="filters__search"
      label="Recherche"
      @input="changeSearch"
    ></v-text-field>
    <SearchTeams
      :teams="teams"
      class="filters__field"
      :boxed="false"
      @change="changeTeams"
    ></SearchTeams>
    <SearchTeams
      :teams="excludedTeams"
      label="Exclure des équipes"
      class="filters__field"
      :boxed="false"
      @change="changeExcludedTeams"
    ></SearchTeams>

    <div class="friend_filter_categoy_sort">
      <div>
        <v-btn-toggle
          v-show="!isOrgaTaskMode"
          tile
          color="deep-purple accent-3"
          group
          @change="changeFriendFilter($event)"
        >
          <v-btn
            v-for="label of friendFilterLabel"
            :id="`friend-filter-${stringify(label)}`"
            :key="label"
            :value="label"
            x-small
          >
            {{ label }}
          </v-btn>
        </v-btn-toggle>
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
import { Team } from "@overbookd/http";
import { nextSortDirection } from "~/utils/models/assignment.model";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import {
  FriendFilter,
  friendFilterLabel,
} from "~/utils/assignment/assignment.utils";
import { SlugifyService } from "@overbookd/slugify";

type VolunteerFiltersData = {
  search: string;
  teams: Team[];
  excludedTeams: Team[];
  sort: number;
  hasNoFriends: boolean;
};

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
    "change:friend-filter",
  ],
  data: (): VolunteerFiltersData => ({
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
    friendFilterLabel(): FriendFilter[] {
      return friendFilterLabel;
    },
  },
  methods: {
    changeSearch(search: string) {
      this.$emit("change:search", search);
    },
    changeTeams(teams: Team[]) {
      this.teams = teams;
      this.$emit("change:teams", teams);
    },
    changeExcludedTeams(excludedTeams: Team[]) {
      this.excludedTeams = excludedTeams;
      this.$emit("change:excluded-teams", excludedTeams);
    },
    updateSort() {
      this.sort = nextSortDirection(this.sort);
      this.$emit("change:sort", this.sort);
    },
    changeFriendFilter(friendFilter: FriendFilter | undefined) {
      this.$emit("change:friend-filter", friendFilter);
    },
    stringify(label: string) {
      return SlugifyService.apply(label);
    },
  },
});
</script>

<style lang="scss" scoped>
.filters {
  width: 100%;
  padding: 0px 15px;
  margin-top: auto;
  height: fit-content;

  &__field {
    width: 100%;
    height: 60px;
    overflow-y: auto;
    overflow-x: hidden;
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

#friend-filter-aucun-ami {
  margin-left: -4px;
}

#friend-filter-aucun-ami,
#friend-filter-amis-disponibles,
#friend-filter-amis-deja-affectes {
  padding: 0 4px;
}
</style>
