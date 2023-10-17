<template>
  <div class="meal-sharing">
    <v-btn
      rounded
      x-large
      class="offer-btn"
      color="primary"
      @click="openOfferingSharedMealForm"
    >
      Proposer <span class="desktop">un repas</span>
    </v-btn>

    <v-dialog v-model="isOfferingSharedMealOpen">
      <OfferSharedMealForm @close-dialog="closeOfferingSharedMealForm" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OfferSharedMealForm from "~/components/organisms/personal-account/OfferSharedMealForm.vue";

export default defineComponent({
  name: "MealSharing",
  components: { OfferSharedMealForm },
  data: () => ({
    isOfferingSharedMealOpen: false,
  }),
  methods: {
    openOfferingSharedMealForm() {
      this.isOfferingSharedMealOpen = true;
    },
    closeOfferingSharedMealForm() {
      this.isOfferingSharedMealOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
@media screen and (max-width: $mobile-max-width) {
  .desktop {
    display: none;
  }
}

.offer-btn {
  width: unset;
  position: fixed;
  bottom: calc(#{$mobile-header-height} + 20px);
  left: 10px;
  right: 10px;
}
</style>
