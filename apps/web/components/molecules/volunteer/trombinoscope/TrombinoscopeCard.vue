<template>
  <v-card class="profilePictureCard">
    <v-card-title class="name-with-picture">
      <ProfilePicture :user="volunteer" />
      <span class="name">{{ formatUserNameWithNickname(volunteer) }}</span>
    </v-card-title>
    <v-card-subtitle opacity="1">
      <div class="teams">
        <TeamChip v-for="team of volunteer.teams" :key="team" :team="team" />
      </div>
    </v-card-subtitle>
  </v-card>
</template>

<script lang="ts" setup>
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

const { volunteer } = defineProps({
  volunteer: {
    type: Object as PropType<UserDataWithPotentialyProfilePicture>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.name {
  font-size: 1.1rem;
  text-wrap: pretty;
}

.teams {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.profilePictureCard {
  display: flex;
  flex-direction: column;
  .name-with-picture {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
