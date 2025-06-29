<template>
  <img
    v-if="hasProfilePictureBlob"
    class="profile-picture__photo"
    :class="size"
    :src="user.profilePictureBlob"
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
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";

const userStore = useUserStore();

const _SMALL = "small";
const _MEDIUM = "medium";
const _LARGE = "large";
type Size = typeof _SMALL | typeof _MEDIUM | typeof _LARGE;

const props = defineProps({
  user: {
    type: Object as PropType<UserDataWithPotentialyProfilePicture>,
    required: true,
  },
  size: {
    type: String as PropType<Size>,
    default: "medium",
  },
});

const hasProfilePicture = computed<boolean>(
  () => props.user.profilePicture !== null,
);
const hasProfilePictureBlob = computed<boolean>(
  () => props.user.profilePictureBlob !== undefined,
);

watch(
  () => props.user.profilePictureBlob,
  () => {
    if (!hasProfilePicture.value || hasProfilePictureBlob.value) return;
    userStore.setProfilePicture(props.user);
  },
  { immediate: true },
);
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
