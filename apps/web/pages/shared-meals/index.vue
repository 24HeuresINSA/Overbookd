<template>
  <DesktopPageTitle />

  <div class="shared-meals-page">
    <aside class="sidebar desktop-only">
      <OfferSharedMealFormCard />
      <v-btn
        text="Historique des repas"
        prepend-icon="mdi-history"
        color="secondary"
        variant="tonal"
        size="large"
        block
        :to="SHARED_MEALS_HISTORY_URL"
      />
    </aside>

    <section class="meals">
      <SharedMealCard v-for="meal in meals" :key="meal.id" :meal="meal" />

      <v-card v-if="meals.length === 0" class="meals__empty">
        <v-icon icon="mdi-silverware-clean" size="64" />
        <p>Aucun repas de prévu pour le moment 🍽️</p>
        <p class="meals__empty-hint">Lance-toi et propose le prochain !</p>
      </v-card>
    </section>
  </div>

  <BottomActionBar class="mobile-buttons mobile-only">
    <v-btn
      text="Proposer"
      prepend-icon="mdi-plus"
      color="primary"
      variant="flat"
      size="large"
      @click="openOfferDialog"
    />
    <v-btn
      text="Historique"
      prepend-icon="mdi-history"
      color="secondary"
      variant="tonal"
      size="large"
      :to="SHARED_MEALS_HISTORY_URL"
    />
  </BottomActionBar>

  <v-dialog v-model="isOfferDialogOpen" max-width="600px">
    <OfferSharedMealFormCard closable @close="closeOfferDialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { OnGoingSharedMeal } from "@overbookd/personal-account";
import { SHARED_MEALS_HISTORY_URL } from "@overbookd/web-page";

useHead({ title: "Repas partagés" });

const mealSharingStore = useMealSharingStore();

const isOfferDialogOpen = ref<boolean>(false);
const openOfferDialog = () => (isOfferDialogOpen.value = true);
const closeOfferDialog = () => (isOfferDialogOpen.value = false);

const meals = computed<OnGoingSharedMeal[]>(
  () => mealSharingStore.onGoingMeals,
);
mealSharingStore.fetchOnGoing();
</script>

<style lang="scss" scoped>
.shared-meals-page {
  display: grid;
  grid-template-columns: minmax(300px, 380px) 1fr;
  align-items: start;
  gap: $card-gap;
  padding: $card-margin;

  @media screen and (max-width: $mobile-max-width) {
    grid-template-columns: 1fr;
  }
}

.sidebar {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}

.meals {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  align-items: start;
  gap: $card-gap;

  @media screen and (max-width: $mobile-max-width) {
    grid-template-columns: 1fr;
  }

  &__empty {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 40px 20px;
    text-align: center;
    font-size: 1.1rem;
    color: rgba(var(--v-theme-on-surface), 0.7);
  }

  &__empty-hint {
    font-size: 0.9rem;
  }
}

.mobile-buttons > * {
  flex: 1 1 0;
}
</style>
