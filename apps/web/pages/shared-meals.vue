<template>
  <DesktopPageTitle />

  <div class="form-and-list">
    <div class="form desktop">
      <OfferSharedMealFormCard />
    </div>

    <div class="meals">
      <SharedMealCard
        v-for="meal in meals"
        :key="meal.id"
        :shared="meal"
        class="meal"
      />
    </div>

    <div class="offer-btn">
      <v-btn
        text="Proposer un repas"
        color="primary"
        size="large"
        rounded
        block
        @click="openOfferDialog"
      />
    </div>
  </div>

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
mealSharingStore.fetchOnGoing();
</script>

<style lang="scss" scoped>
.offer-btn {
  display: none;
  width: 100%;
  padding: 0 10px;
}

@media screen and (max-width: $mobile-max-width) {
  .desktop {
    display: none;
  }
  .offer-btn {
    display: block;
  }
}

.form-and-list {
  position: relative;
  display: flex;
  align-items: start;
  gap: 20px;
  height: calc(90vh - #{$header-height});
  overflow-y: scroll;

  .form {
    position: sticky;
    top: 0;
    flex: 2 1 0;
  }

  .meals {
    flex: 3 1 0;
    padding: 5px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .meal {
      min-width: 95%;
    }
  }

  @media screen and (max-width: 1150px) {
    flex-direction: column;
    gap: 10px;
    height: initial;

    .form,
    .meals {
      position: relative;
      flex: initial;
      width: 100%;
    }
  }

  @media screen and (max-width: $mobile-max-width) {
    height: 100%;
    gap: 10px;

    .meals {
      flex: 1 1 auto;
      overflow-y: scroll;
      min-height: 0;
    }
  }
}
</style>
