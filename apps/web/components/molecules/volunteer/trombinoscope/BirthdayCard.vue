<template>
  <v-card
    class="birthday-card"
    color="primary"
    @click="propagateClickedVolunteer"
  >
    <v-card-title class="birthday-card__heading">
      <ProfilePicture size="large" :user="volunteer" />
      <p>Joyeux anniv 🎂</p>
      <p class="name">{{ buildUserNameWithNickname(volunteer) }}</p>
    </v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
import {
  buildUserNameWithNickname,
  type UserPersonalData,
} from "@overbookd/user";

const { volunteer } = defineProps({
  volunteer: {
    type: Object as PropType<UserPersonalData>,
    required: true,
  },
});

const emit = defineEmits(["click"]);
const propagateClickedVolunteer = () => {
  emit("click", volunteer);
};
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
      text-wrap: wrap;
      margin: 0;
    }
  }
}
</style>
