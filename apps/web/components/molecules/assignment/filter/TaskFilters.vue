<template>
  <div class="filters">
    <v-text-field
      :value="search"
      class="filters__search"
      label="Recherche"
      hide-details
      @input="changeSearch"
    />
    <SearchTeam
      :teams="requiredTeams"
      label="Chercher par équipe requise"
      class="filters__field filter__multi-select"
      hide-details
      @change="changeTeamsRequired"
    />
    <SearchTeam
      :value="inChargeTeam"
      label="Chercher par équipe responsable"
      class="filters__field"
      hide-details
      @change="changeInChargeTeam"
    />
    <div class="team-filter-completed-switch">
      <v-combobox
        :value="category"
        :items="categoryItems"
        label="Chercher une catégorie"
        class="filters__field"
        clearable
        return-object
        hide-details
        @change="changeCategory"
      />
      <v-switch
        v-show="!isOrgaTask"
        v-model="completed"
        label="Toutes les FTs"
        class="filters__switch"
        hide-details
        @change="changeCompleted"
      />
      <v-switch
        v-show="isOrgaTask"
        v-model="hasAssignedFriends"
        label="Amis assignés"
        class="filters__switch"
        hide-details
        @change="changeHasAssignedFriends"
      />
    </div>
    <p class="stats">
      {{ counterLabel }}
      <span class="font-weight-bold">{{ listLength }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
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
    type: String,
    default: "ft",
  },
  listLength: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits([
  "change:search",
  "change:teams-required",
  "change:team-in-charge",
  "change:category",
  "change:completed",
  "change:has-assigned-friends",
]);

const search = ref<string>("");
const requiredTeams = ref<Team[]>([]);
const inChargeTeam = ref<Team | null>(null);
const category = ref<Category | TaskPriority | null>(null);
const completed = ref<boolean>(false);
const hasAssignedFriends = ref<boolean>(false);

const isOrgaTask = computed<boolean>(() => {
  return isOrgaTaskMode(router.currentRoute.value.fullPath);
});

const changeSearch = (value: string) => {
  search.value = value;
  emit("change:search", value);
};

const changeTeamsRequired = (teams: Team[]) => {
  requiredTeams.value = teams;
  emit("change:teams-required", teams);
};

const changeInChargeTeam = (team: Team | null) => {
  inChargeTeam.value = team;
  emit("change:team-in-charge", team);
};

const categoryItems = computed<string[]>(() => {
  return [...Object.values(TaskPriorities), ...displayableCategories];
});

const changeCategory = (value: Category | null) => {
  category.value = value;
  emit("change:category", value);
};

const changeCompleted = (value: boolean) => {
  completed.value = value;
  emit("change:completed", value);
};

const changeHasAssignedFriends = (value: boolean) => {
  hasAssignedFriends.value = value;
  emit("change:has-assigned-friends", value);
};

const counterLabel = computed<string>(() => {
  return props.type === "ft"
    ? "Nombre de FT dans la liste : "
    : "Nombre de créneaux dans la liste : ";
});
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
