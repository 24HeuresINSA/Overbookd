<template>
  <div class="shared-meals">
    <h1>Repas partagés</h1>
    <div class="form-and-list">
      <OfferSharedMealForm class="form desktop" />
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
      rounded
      x-large
      class="offer-btn"
      color="primary"
      @click="openOfferDialog"
    >
      Proposer un repas
    </v-btn>
    <v-dialog v-model="isOfferDialogOpen" max-width="600px">
      <OfferSharedMealForm closable @close-dialog="closeOfferDialog" />
    </v-dialog>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { OnGoingSharedMeal } from "@overbookd/personal-account";
import { defineComponent } from "vue";
import OfferSharedMealForm from "~/components/organisms/personal-account/OfferSharedMealForm.vue";
import SharedMealCard from "~/components/molecules/personal-account/SharedMealCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

type SharedMealsData = {
  isOfferDialogOpen: boolean;
};

export default defineComponent({
  name: "SharedMeals",
  components: {
    OfferSharedMealForm,
    SharedMealCard,
    SnackNotificationContainer,
  },
  data: (): SharedMealsData => ({
    isOfferDialogOpen: false,
  }),
  computed: {
    meals(): OnGoingSharedMeal[] {
      return this.$accessor.mealSharing.onGoingMeals;
    },
  },
  mounted() {
    this.$accessor.mealSharing.fetchAll();
  },
  methods: {
    openOfferDialog() {
      this.isOfferDialogOpen = true;
    },
    closeOfferDialog() {
      this.isOfferDialogOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.offer-btn {
  display: none;
}

@media only screen and (max-width: $mobile-max-width) {
  .desktop {
    display: none;
  }
  .offer-btn {
    display: block;
    width: calc(100vw - 20px);
    position: fixed;
    bottom: calc(#{$mobile-header-height} + 20px);
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
    max-height: calc(90vh - #{$header-height} - #{$footer-height});
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
