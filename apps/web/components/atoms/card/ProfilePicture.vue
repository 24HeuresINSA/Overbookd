<template>
  <v-img
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
import { UserPersonnalData } from "@overbookd/user";
import { UserPersonnalDataWithProfilePicture } from "~/utils/models/user.model";

export default Vue.extend({
  name: "ProfilePicture",
  props: {
    user: {
      type: Object as () => UserPersonnalDataWithProfilePicture,
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
    hasProfilePicture(user: UserPersonnalDataWithProfilePicture): boolean {
      return user.profilePicture !== null;
    },
    getProfilePictureBlob(user: UserPersonnalData) {
      return this.$accessor.user.setProfilePicture(user);
    },
  },
});
</script>

<style lang="scss" scoped>
.userProfilePicture {
  max-height: 150px;
  object-fit: cover;
}

.defaultProfilePicture {
  font-size: 100px;
  align-self: center;
  &.small {
    font-size: 55px;
    @media only screen and (max-width: $mobile-max-width) {
      font-size: 45px;
    }
  }
}
</style>
