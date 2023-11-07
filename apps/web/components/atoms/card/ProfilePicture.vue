<template>
  <img
    v-if="hasProfilePicture(user)"
    class="userProfilePicture"
    :class="{ small }"
    :src="user.profilePictureBlob"
  />
  <v-icon v-else class="defaultProfilePicture" :class="{ small }">
    mdi-account-circle
  </v-icon>
</template>

<script lang="ts">
import Vue from "vue";
import { UserPersonalData } from "@overbookd/user";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";

export default Vue.extend({
  name: "ProfilePicture",
  props: {
    user: {
      type: Object as () => UserPersonalDataWithProfilePicture,
      required: true,
    },
    small: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  mounted() {
    if (!this.hasProfilePicture(this.user)) return;
    this.getProfilePictureBlob(this.user);
  },
  methods: {
    hasProfilePicture(user: UserPersonalDataWithProfilePicture): boolean {
      return user.profilePicture !== null;
    },
    getProfilePictureBlob(user: UserPersonalData) {
      return this.$accessor.user.setProfilePicture(user);
    },
  },
});
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
