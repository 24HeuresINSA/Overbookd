<template>
  <img
    v-if="hasProfilePictureBlob"
    class="profile-picture__photo"
    :class="{ small }"
    :src="user.profilePictureBlob"
  />
  <v-icon v-else class="profile-picture__icon" :class="{ small }">
    mdi-account-circle
  </v-icon>
</template>

<script lang="ts" setup>
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";

const props = defineProps({
  user: {
    type: Object as PropType<UserDataWithPotentialyProfilePicture>,
    required: true,
  },
  small: {
    type: Boolean,
    default: false,
  },
});
const userStore = useUserStore();

const hasProfilePicture = computed<boolean>(
  () => props.user.profilePicture !== null,
);
const hasProfilePictureBlob = computed<boolean>(
  () => props.user.profilePictureBlob !== undefined,
);

const fetchProfilePictureBlob = () => userStore.setProfilePicture(props.user);

watch(
  () => props.user.profilePictureBlob,
  () => {
    if (!hasProfilePicture.value || hasProfilePictureBlob.value) return;
    fetchProfilePictureBlob();
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.profile-picture {
  &__photo {
    height: 150px;
    width: 150px;
    border-radius: 50%;
    object-fit: cover;
    &.small {
      height: 45px;
      width: 45px;
    }
  }

  &__icon {
    font-size: 150px;
    opacity: 0.9;
    &.small {
      font-size: 50px;
    }
  }
}
</style>
