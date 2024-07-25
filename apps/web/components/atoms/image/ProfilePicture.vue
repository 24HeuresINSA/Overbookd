<template>
  <img
    v-if="hasProfilePictureBlob"
    class="userProfilePicture"
    :class="{ small }"
    :src="user.profilePictureBlob"
  />
  <v-icon v-else class="defaultProfilePicture" :class="{ small }">
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

const fetchProfilePictureBlob = () => {
  return userStore.setProfilePicture(props.user);
};

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
.userProfilePicture {
  height: 150px;
  width: 150px;
  border-radius: 50%;
  object-fit: cover;
  padding: 15px;
}

.defaultProfilePicture {
  font-size: 150px;
  align-self: center;
  &.small {
    font-size: 55px;
    @media only screen and (max-width: $mobile-max-width) {
      font-size: 45px;
    }
  }
}
</style>
