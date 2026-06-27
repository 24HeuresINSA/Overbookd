<template>
  <DesktopPageTitle />

  <div class="form-and-list">
    <div class="form">
      <OfferSharedMealFormCard />

      <div class="see-history">
        <v-btn
          text="Voir l'historique des repas"
          color="secondary"
          size="large"
          rounded
          block
          :to="SHARED_MEALS_HISTORY_URL"
        />
      </div>
    </div>

    <div class="meals">
      <SharedMealCard
        v-for="meal in meals"
        :key="meal.id"
        :meal="meal"
        class="meal"
      />
    </div>

    <div class="mobile-buttons">
      <v-btn
        text="Proposer un repas"
        color="primary"
        size="large"
        rounded
        block
        @click="openOfferDialog"
      />

      <v-btn
        text="Voir l'historique des repas"
        color="secondary"
        size="large"
        rounded
        block
        :to="SHARED_MEALS_HISTORY_URL"
      />
    </div>
  </div>

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
.mobile-buttons {
  display: none;
  width: 100%;
  padding: 0 10px;

  @media screen and (max-width: $mobile-max-width) {
    display: flex;
    flex-direction: column;
    gap: 10px;
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

    display: flex;
    flex-direction: column;
    gap: 20px;

    .see-history {
      margin-inline: 20px;
    }

    @media screen and (max-width: $mobile-max-width) {
      display: none;
    }
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
