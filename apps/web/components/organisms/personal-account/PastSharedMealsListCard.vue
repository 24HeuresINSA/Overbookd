<template>
  <v-card>
    <v-card-text>
      <div class="filters">
        <v-text-field
          v-model="search"
          label="Rechercher un repas"
          clear-icon="mdi-close-circle-outline"
          autofocus
          clearable
          hide-details
        />

        <v-switch
          v-model="onlyMyMeals"
          label="Afficher seulement les repas où j'ai participé"
          color="primary"
          :readonly="!isSharedMealManager"
          :class="{ 'no-pointer': !isSharedMealManager }"
          hide-details
        />
      </div>

      <v-data-table
        :headers="headers"
        :items="filteredMeals"
        :loading="loading"
        loading-text="Chargement des repas..."
        no-data-text="Tu n'as participé à aucun repas partagé"
        :mobile="isMobile"
        :striped="isMobile ? 'odd' : undefined"
        multi-sort
        hover
        return-object
        @click:row="openMealDetails"
      >
        <template #item.createdAt="{ item }">
          {{ formatDateWithMinutes(item.createdAt) }}
        </template>

        <template #item.date="{ item }">
          <span class="meal-date">
            {{ item.meal.date }}
          </span>
        </template>

        <template #item.areMultipleShotgunsAllowed="{ item }">
          <v-icon
            v-if="item.areMultipleShotgunsAllowed"
            icon="mdi-check-circle"
            aria-label="Shotguns multiples autorisés"
            title="Shotguns multiples autorisés"
          />
        </template>

        <template #item.expense.amount="{ item }">
          {{ Money.cents(item.expense.amount) }}
        </template>

        <template #item.closedAt="{ item }">
          {{ formatDateWithMinutes(item.closedAt) }}
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <v-dialog v-model="isMealDetailsDialogOpen" width="1000px">
    <PastSharedMealCard
      v-if="selectedMeal"
      :meal="selectedMeal"
      @close="closeMealDetails"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { Money } from "@overbookd/money";
import { MANAGE_SHARED_MEALS } from "@overbookd/permission";
import type { PastSharedMeal } from "@overbookd/personal-account";
import { formatDateWithMinutes } from "@overbookd/time";
import { slugifiedFilter, type Searchable } from "~/utils/search/search.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const headers: TableHeaders = [
  { title: "Date de création", key: "createdAt", sortable: true },
  { title: "Date du repas", key: "date" },
  { title: "Chef·fe", key: "chef.name", sortable: true },
  {
    title: "Nombre de portions",
    key: "portionCount",
    align: "center",
    sortable: true,
  },
  {
    title: "Nombre de convives",
    key: "shotguns.length",
    align: "center",
    sortable: true,
  },
  {
    title: "Shotgun multiples",
    key: "areMultipleShotgunsAllowed",
    align: "center",
    sortable: true,
  },
  { title: "Coût total du repas", key: "expense.amount", sortable: true },
  { title: "Date de clôture", key: "closedAt", sortable: true },
];

const layoutStore = useLayoutStore();
const mealSharingStore = useMealSharingStore();
const userStore = useUserStore();

const isMobile = computed<boolean>(() => layoutStore.isMobile);
const isSharedMealManager = computed<boolean>(() =>
  userStore.can(MANAGE_SHARED_MEALS),
);

const onlyMyMeals = ref<boolean>(!isSharedMealManager.value);
const search = ref<string>("");

const meals = computed<Searchable<PastSharedMeal>[]>(() =>
  mealSharingStore.pastMeals.map((sharedMeal) => {
    const { chef, meal } = sharedMeal;
    const searchable = `${chef.name} ${meal.date} ${meal.menu}`;
    return { ...sharedMeal, searchable };
  }),
);
const filteredMeals = computed<PastSharedMeal[]>(() =>
  meals.value.filter((meal) => filterMealBySearch(meal, search.value)),
);

const filterMealBySearch = (
  meal: Searchable<PastSharedMeal>,
  search: string | null,
): boolean => {
  if (!search) return true;
  return slugifiedFilter(meal.searchable, search) !== -1;
};

const loading = ref<boolean>(false);
watch(
  onlyMyMeals,
  async (displayOnlyMyMeals) => {
    loading.value = true;

    const fetchAllMeals = isSharedMealManager.value && !displayOnlyMyMeals;
    await (fetchAllMeals
      ? mealSharingStore.fetchAllPast()
      : mealSharingStore.fetchMyPast());

    loading.value = false;
  },
  { immediate: true },
);

const isMealDetailsDialogOpen = ref<boolean>(false);
const selectedMeal = ref<PastSharedMeal>();
const openMealDetails = (_: MouseEvent, { item }: { item: PastSharedMeal }) => {
  selectedMeal.value = item;
  isMealDetailsDialogOpen.value = true;
};
const closeMealDetails = () => {
  isMealDetailsDialogOpen.value = false;
};
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  column-gap: 20px;
  row-gap: 10px;
  align-items: center;
  margin-bottom: 10px;

  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;

    .v-input {
      width: 100%;
    }
  }
}

.no-pointer {
  pointer-events: none;
}

.meal-date {
  text-transform: capitalize;
}
</style>
