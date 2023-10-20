<template>
  <v-card class="shared-meal">
    <v-card-title class="meal-title">
      Repas partagé du <wbr /> {{ shared.meal.date }}
    </v-card-title>
    <v-card-text>
      <v-divider role="presentation" />
      <div class="chief">
        <v-icon>mdi-chef-hat</v-icon>
        <ProfilePicture
          small
          class="profile-picture"
          :user="chefPersonalData"
        />
        <span>{{ shared.chef.name }}</span>
      </div>
      <v-divider role="presentation" />
      <div class="menu">
        <h3>Au menu</h3>
        <p>{{ shared.meal.menu }}</p>
      </div>
      <v-divider role="presentation" />
      <div class="shotgun">
        <span class="shotgun__numbers">{{ shared.shotguns }} participants</span>
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
import { Adherent, IExposeSharedMeal } from "@overbookd/personal-account";
import Vue from "vue";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";

export default Vue.extend({
  name: "SharedMealCard",
  components: { ProfilePicture },
  props: {
    shared: {
      type: Object as () => IExposeSharedMeal,
      required: true,
    },
  },
  computed: {
    me(): Adherent {
      const { id, firstname, lastname, nickname } = this.$accessor.user.me;
      return { id, name: nickname ?? `${firstname} ${lastname}` };
    },
    hasShotgun(): boolean {
      return this.shared.hasShotgun(this.me) ?? false;
    },
    chefPersonalData() {
      return this.$accessor.user.users.find(
        ({ id }) => id === this.$accessor.mealSharing.sharedMeal?.chef.id,
      );
    },
  },
});
</script>

<style lang="scss">
.meal-title {
  text-wrap: nowrap;
}
</style>
