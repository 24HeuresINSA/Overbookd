<template>
  <div class="filters">
    <v-text-field
      v-model="search"
      class="filters__field"
      label="Recherche"
      density="compact"
      hide-details
      clearable
      @click:clear="search = ''"
    />

    <SearchTeams
      v-model="requiredTeams"
      label="Chercher par équipe(s) requise(s)"
      class="filters__field"
      density="compact"
      closable-chips
      hide-details
      clearable
    />

    <SearchTeam
      v-model="inChargeTeam"
      label="Chercher par équipe responsable"
      class="filters__field"
      density="compact"
      hide-details
      clearable
    />

    <v-combobox
      v-model="category"
      :items="categoryItems"
      label="Chercher une catégorie"
      class="filters__field"
      density="compact"
      clearable
      return-object
      hide-details
    />

    <div class="filters-row">
      <v-switch
        v-if="isOrgaTask"
        v-model="hasAssignedFriends"
        label="Ami·e·s affecté·e·s"
        density="compact"
        color="primary"
        class="filters-row__switch"
        hide-details
      />
      <v-switch
        v-else
        v-model="completed"
        label="FTs completées"
        density="compact"
        color="primary"
        class="filters-row__switch"
        hide-details
      />
      <v-switch
        v-model="past"
        label="FTs passées"
        density="compact"
        color="primary"
        class="filters-row__switch"
        hide-details
      />
    </div>

    <p class="stats">
      {{ counterLabel }}
      <span class="font-weight-bold">{{ listLength }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { FestivalEventIdentifier } from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import {
  displayableCategories,
  type DisplayableCategory,
} from "~/utils/assignment/task-category";
import {
  TaskPriorities,
  type TaskPriority,
} from "~/utils/assignment/task-priority";

const route = useRoute();

const props = defineProps({
  type: {
    type: String as PropType<FestivalEventIdentifier>,
    default: "FT",
  },
  listLength: {
    type: Number,
    default: 0,
  },
});

const search = defineModel<string>("search", { default: "" });
const requiredTeams = defineModel<Team[]>("requiredTeams", {
  default: () => [],
});
const inChargeTeam = defineModel<Team | null>("inChargeTeam");
const category = defineModel<DisplayableCategory | TaskPriority | undefined>(
  "category",
);
const completed = defineModel<boolean>("completed", { default: false });
const past = defineModel<boolean>("past", { default: false });
const hasAssignedFriends = defineModel<boolean>("hasAssignedFriends", {
  default: false,
});

const isOrgaTask = computed<boolean>(() => isOrgaTaskMode(route.path));
const categoryItems = computed<string[]>(() => [
  ...Object.values(TaskPriorities),
  ...displayableCategories,
]);

const counterLabel = computed<string>(() =>
  props.type === "FT"
    ? "Nombre de FT dans la liste : "
    : "Nombre de créneaux dans la liste : ",
);
</script>

<style lang="scss" scoped>
@use "~/assets/assignment.scss" as *;

.filters {
  width: 100%;
  padding: 5px 15px 0 15px;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  &__field {
    width: 100%;
    overflow: visible;
  }
}
.stats {
  margin-bottom: 5px;
}

.filters-row {
  display: flex;
  gap: 0 10px;
  align-items: center;
  flex-wrap: wrap;
  &__switch {
    margin: -5px 0 -5px 10px;
  }
}
</style>
