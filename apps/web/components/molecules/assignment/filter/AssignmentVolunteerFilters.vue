<template>
  <div class="filters">
    <v-text-field
      v-model="search"
      class="filters__field"
      label="Recherche"
      density="compact"
      hide-details
    />
    <SearchTeams
      v-model="teams"
      class="filters__field"
      density="compact"
      hide-details
    />
    <SearchTeams
      v-model="excludedTeams"
      label="Exclure des équipes"
      class="filters__field"
      density="compact"
      hide-details
    />

    <div class="friend-filter__categoy-sort">
      <div>
        <v-btn-toggle
          v-show="isTaskOrga"
          v-model="friendFilter"
          color="deep-purple accent-3"
          tile
          group
        >
          <v-btn
            v-for="label of friendFilterLabel"
            :id="`friend-filter-${stringify(label)}`"
            :key="label"
            :value="label"
            size="x-small"
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
        <v-tooltip location="top">
          <template #activator="activator">
            <v-icon v-if="!sort" v-bind="activator.props" icon="mdi-sort" />
            <v-icon
              v-else-if="sort > 0"
              v-bind="activator.props"
              icon="mdi-sort-ascending"
            />
            <v-icon
              v-else
              v-bind="activator.props"
              icon="mdi-sort-descending"
            />
          </template>
          Trier par tache
        </v-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import { nextSortDirection, Sort } from "~/utils/sort/sort.utils";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import {
  type FriendFilter,
  friendFilterLabel,
} from "~/utils/assignment/assignment.utils";
import { SlugifyService } from "@overbookd/slugify";

const route = useRoute();

defineProps({
  listLength: {
    type: Number,
    default: 0,
  },
});

const search = defineModel<string>("search", { default: "" });
const teams = defineModel<Team[]>("teams", { default: [] });
const excludedTeams = defineModel<Team[]>("excludedTeams", { default: [] });
const sort = defineModel<number>("sort", { default: Sort.NONE });
const friendFilter = defineModel<FriendFilter | undefined>("friendFilter", {
  default: undefined,
});

const isTaskOrga = computed<boolean>(() => !isOrgaTaskMode(route.path));

const updateSort = () => (sort.value = nextSortDirection(sort.value));

const stringify = (label: string) => SlugifyService.apply(label);
</script>

<style lang="scss" scoped>
@use "~/assets/assignment.scss" as *;

.filters {
  width: 100%;
  padding: 5px 15px 0 15px;
  margin-top: auto;
  height: $volunteer-list-filters-height;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;

  &__field {
    width: 100%;
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

.friend-filter__categoy-sort {
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
