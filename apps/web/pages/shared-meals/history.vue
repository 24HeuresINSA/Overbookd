<template>
  <DesktopPageTitle />

  <PastSharedMealsListCard :meals :loading />
</template>

<script lang="ts" setup>
import { MANAGE_SHARED_MEALS } from "@overbookd/permission";
import type { PastSharedMeal } from "@overbookd/personal-account";

useHead({ title: "Historique des repas partagés" });

const mealSharingStore = useMealSharingStore();
const userStore = useUserStore();

const meals = computed<PastSharedMeal[]>(() => mealSharingStore.pastMeals);

const loading = ref<boolean>(true);

await (
  userStore.can(MANAGE_SHARED_MEALS)
    ? mealSharingStore.fetchAllPast()
    : mealSharingStore.fetchMyPast()
).then(() => (loading.value = false));
</script>
