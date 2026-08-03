<template>
  <img
    v-if="user.profilePicture"
    class="profile-picture__photo"
    :class="size"
    :src="user.profilePicture"
    alt="Photo de profil"
  />
  <v-icon
    v-else
    icon="mdi-account-circle"
    aria-label="Photo de profil"
    class="profile-picture__icon"
    :class="size"
  />
</template>

<script lang="ts" setup>
import type { UserPersonalData } from "@overbookd/user";

const _SMALL = "small";
const _MEDIUM = "medium";
const _LARGE = "large";
type Size = typeof _SMALL | typeof _MEDIUM | typeof _LARGE;

defineProps({
  user: {
    type: Object as PropType<UserPersonalData>,
    required: true,
  },
  size: {
    type: String as PropType<Size>,
    default: "medium",
  },
});
</script>

<style lang="scss" scoped>
.profile-picture {
  &__photo {
    border-radius: 50%;
    object-fit: cover;
    &.small {
      height: 45px;
      width: 45px;
    }
    &.medium {
      height: 80px;
      width: 80px;
    }
    &.large {
      height: 150px;
      width: 150px;
    }
  }

  &__icon {
    opacity: 0.8;
    &.small {
      font-size: 50px;
    }
    &.medium {
      font-size: 100px;
    }
    &.large {
      font-size: 150px;
    }
  }
}
</style>
