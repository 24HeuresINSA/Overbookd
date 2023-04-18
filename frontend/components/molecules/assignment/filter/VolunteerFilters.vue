<template>
  <div class="volunteer-filters">
    <div class="filters">
      <div class="filters__column">
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
      </div>
      <div class="filters__column icons">
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-icon v-bind="attrs" :color="friendFilter ? 'red' : ''" v-on="on">
              mdi-account-cancel
            </v-icon>
          </template>
          <span>Filter si pas d'amis</span>
        </v-tooltip>
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
    <p class="stats">
      Nombre de bénévoles dans la liste :
      <span class="font-weight-bold">{{ listLength }}</span>
    </p>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Team } from "~/utils/models/team";
import { nextSortDirection } from "~/utils/models/assignment";
import SearchTeams from "~/components/atoms/field/search/SearchTeams.vue";

export default Vue.extend({
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
  data: () => ({
    search: "",
    teams: [],
    sort: 0,
    friendFilter: false,
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
  },
});
</script>

<style lang="scss" scoped>
.volunteer-filters {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 140px;
  justify-content: center;
  align-items: center;
  margin-top: 25px;
  padding: 0 25px;
}

.filters {
  display: flex;

  &__column {
    display: flex;
    flex-direction: column;
    height: 100%;
    align-items: center;
    justify-content: center;
  }

  &__field {
    width: 100%;
    padding-top: 0;
    margin-top: 0;
  }
}

.icons {
  gap: 20px;
  margin-left: 20px;
  * {
    cursor: pointer;
  }
}

.stats {
  margin-bottom: 5px;
}
</style>
