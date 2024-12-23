<template>
  <div class="filters">
    <v-text-field
      v-model="search"
      class="filters__search"
      label="Recherche"
      density="compact"
      hide-details
    />
    <SearchTeam
      v-model="requiredTeams"
      label="Chercher par équipe requise"
      class="filters__field filter__multi-select"
      density="compact"
      hide-details
    />
    <SearchTeam
      v-model="inChargeTeam"
      label="Chercher par équipe responsable"
      class="filters__field"
      density="compact"
      hide-details
    />
    <div class="team-filter-completed-switch">
      <v-combobox
        v-model="category"
        :items="categoryItems"
        label="Chercher une catégorie"
        class="filters__field"
        clearable
        return-object
        hide-details
      />
      <v-switch
        v-show="!isOrgaTask"
        v-model="completed"
        label="Toutes les FTs"
        class="filters__switch"
        density="compact"
        hide-details
      />
      <v-switch
        v-show="isOrgaTask"
        v-model="hasAssignedFriends"
        label="Amis assignés"
        class="filters__switch"
        density="compact"
        color="primary"
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
import type { Category } from "@overbookd/festival-event-constants";
import type { Team } from "@overbookd/team";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import { displayableCategories } from "~/utils/assignment/task-category";
import {
  TaskPriorities,
  type TaskPriority,
} from "~/utils/assignment/task-priority";

const router = useRouter();

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

const search = ref<string>("");
const requiredTeams = ref<Team[]>([]);
const inChargeTeam = ref<Team | null>(null);
const category = ref<Category | TaskPriority | null>(null);
const completed = ref<boolean>(false);
const hasAssignedFriends = ref<boolean>(false);

const isOrgaTask = computed<boolean>(() =>
  isOrgaTaskMode(router.currentRoute.value.fullPath),
);
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
.filters {
  width: 100%;
  height: fit-content;
  padding: 0px 15px;
  margin-top: auto;
  &__field {
    width: 100%;
    padding: 5px, 0px;
    height: 65px;
    overflow-y: auto;
    overflow-x: hidden;
  }
  &__multi-select {
    max-height: 200px;
  }
}

.stats {
  margin-bottom: 5px;
}

.team-filter-completed-switch {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  .filters {
    &__switch {
      margin-top: 0;
      margin-right: 5px;
    }
  }
}
</style>
