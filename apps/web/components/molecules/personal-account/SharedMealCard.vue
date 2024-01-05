<template>
  <v-card class="shared-meal">
    <v-card-title class="meal-title">
      {{ shared.meal.date }}
    </v-card-title>
    <v-card-text class="presentation">
      <div class="chief">
        <v-icon>mdi-chef-hat</v-icon>
        <span>{{ shared.chef.name }}</span>
      </div>

      <div class="menu">
        <v-textarea
          outlined
          label="Au menu 🍴"
          :value="shared.meal.menu"
          readonly
          hide-details
          :rows="4"
        ></v-textarea>
      </div>

      <div class="shotgun">
        <span class="shotgun__numbers">{{ shared.shotgunCount }} convives</span>
        <v-btn
          v-if="hasShotgun"
          class="shotgun__action"
          color="primary"
          dark
          large
        >
          Partager <v-icon right>mdi-share</v-icon>
        </v-btn>
        <v-btn v-else class="shotgun__action" color="primary" dark large>
          Shotgun <v-icon right>mdi-account-multiple-plus</v-icon>
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Adherent, SharedMeal } from "@overbookd/personal-account";
import { nicknameOrName } from "@overbookd/user";

export default defineComponent({
  name: "SharedMealCard",
  components: {},
  props: {
    shared: {
      type: Object as () => SharedMeal,
      required: true,
    },
  },
  computed: {
    me(): Adherent {
      const { id, ...me } = this.$accessor.user.me;
      return { id, name: nicknameOrName(me) };
    },
    hasShotgun(): boolean {
      return false;
    },
    chefPersonalData() {
      return this.$accessor.user.users.find(
        ({ id }) => id === this.$accessor.mealSharing.sharedMeal?.chef.id,
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.meal-title {
  text-transform: capitalize;
}
.presentation {
  display: flex;
  gap: 15px;
  align-items: center;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    min-width: 100%;
    .chief,
    .menu,
    .shotgun {
      min-width: 100%;
    }
  }
  .chief {
    flex-grow: 1;
    display: flex;
    align-items: baseline;
    gap: 3px;
    font-size: 1.2rem;
    i {
      font-size: 2rem;
    }
  }
  .menu {
    flex-grow: 3;
  }
  .shotgun {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
