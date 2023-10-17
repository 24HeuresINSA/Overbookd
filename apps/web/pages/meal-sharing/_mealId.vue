<template>
  <div class="meal-sharing">
    <SharedMealCard
      v-if="shared && users.length"
      :shared="shared"
      :chef-personal-data="chefPersonalData"
    ></SharedMealCard>
  </div>
</template>

<script lang="ts">
import { IExposeSharedMeal } from "@overbookd/personal-account";
import Vue from "vue";
import SharedMealCard from "~/components/molecules/personal-account/SharedMealCard.vue";

export default Vue.extend({
  name: "SharedMeal",
  components: { SharedMealCard },
  computed: {
    mealId(): number {
      return +this.$route.params.mealId;
    },
    users() {
      return this.$accessor.user.users;
    },
    shared(): IExposeSharedMeal | undefined {
      const shared = this.$accessor.mealSharing.sharedMeal;
      if (!shared) return undefined;
      return shared;
    },
    chefPersonalData() {
      return this.$accessor.user.users.find(
        ({ id }) => id === this.$accessor.mealSharing.sharedMeal?.chef.id,
      );
    },
  },
  mounted() {
    if (this.users.length === 0) {
      this.$accessor.user.fetchUsers();
    }
    if (this.mealId !== this.shared?.id) {
      this.$accessor.mealSharing.find(this.mealId);
    }
  },
});
</script>

<style lang="scss" scoped>
.meal-title {
  text-wrap: nowrap;
}
</style>
