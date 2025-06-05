<template>
  <DesktopPageTitle />
  <div class="form-and-list">
    <OfferSharedMealFormCard class="form desktop" />
    <div class="meals">
      <SharedMealCard
        v-for="meal in meals"
        :key="meal.id"
        :shared="meal"
        class="meal"
      />
    </div>
  </div>
  <v-btn
    text="Proposer un repas"
    class="offer-btn"
    color="primary"
    size="large"
    rounded
    @click="openOfferDialog"
  />

  <v-dialog v-model="isOfferDialogOpen" max-width="600px">
    <OfferSharedMealFormCard closable @close="closeOfferDialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { OnGoingSharedMeal } from "@overbookd/personal-account";

useHead({ title: "Repas partagés" });

const mealSharingStore = useMealSharingStore();

const isOfferDialogOpen = ref<boolean>(false);
const openOfferDialog = () => (isOfferDialogOpen.value = true);
const closeOfferDialog = () => (isOfferDialogOpen.value = false);

const meals = computed<OnGoingSharedMeal[]>(
  () => mealSharingStore.onGoingMeals,
);
mealSharingStore.fetchAll();
</script>

<style lang="scss" scoped>
.offer-btn {
  display: none;
}

@media screen and (max-width: $mobile-max-width) {
  .desktop {
    display: none;
  }
  .offer-btn {
    display: block;
    width: calc(100vw - 20px);
    position: fixed;
    bottom: calc($bottom-nav-height + 20px);
    left: 10px;
    right: 10px;
  }
}

.form-and-list {
  display: flex;
  align-items: center;
  gap: 20px;
  .form {
    flex-grow: 1;
  }
  .meals {
    flex-grow: 3;
    padding: 5px;
    max-height: calc(90vh - #{$header-height});
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow-y: scroll;
    .meal {
      min-width: 95%;
    }
    @media screen and (max-width: $mobile-max-width) {
      padding-bottom: 70px;
    }
  }
}
</style>
