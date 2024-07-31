<template>
  <v-card class="birthday-card" color="#FFD700">
    <v-card-title class="birthday-card__heading">
      <ProfilePicture :user="volunteer" />
      <p>Joyeux anniv 🎂</p>
      <p class="name">{{ buildUserNameWithNickname(volunteer) }}</p>
    </v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
import { buildUserNameWithNickname } from "@overbookd/user";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";

const { volunteer } = defineProps({
  volunteer: {
    type: Object as PropType<UserDataWithPotentialyProfilePicture>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.birthday-card {
  display: flex;
  flex-direction: column;
  &__heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      font-size: 1.1rem;
      text-wrap: pretty;
      margin: 0;
    }
  }
}
</style>
