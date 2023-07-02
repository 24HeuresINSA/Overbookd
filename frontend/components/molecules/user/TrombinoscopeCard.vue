<template>
  <v-card style="margin: 5px" max-width="250px">
    <v-img
      v-if="hasProfilePicture(user)"
      :src="user.profilePictureBlob"
      max-height="250px"
    />
    <v-card-title>{{ formatUserNameWithNickname(user) }} </v-card-title>
    <v-card-subtitle>
      <OverChips :roles="user.team"></OverChips>
    </v-card-subtitle>
    <v-card-text style="overflow-y: hidden">
      {{ user.comment }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import OverChips from "~/components/atoms/chip/OverChips.vue";
import { CompleteUserWithPermissions } from "~/utils/models/user";
import { formatUserNameWithNickname } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "TrombinoscopeCard",
  components: { OverChips },
  props: {
    user: { type: Object as () => CompleteUserWithPermissions, required: true },
  },
  mounted() {
    if (!this.hasProfilePicture(this.user)) return;
    this.getProfilePictureBlob(this.user);
  },
  methods: {
    hasProfilePicture(user: CompleteUserWithPermissions): boolean {
      return user.profilePicture !== undefined;
    },
    getProfilePictureBlob(user: CompleteUserWithPermissions) {
      return this.$accessor.user.setProfilePicture(user);
    },
    formatUserNameWithNickname,
  },
});
</script>

<style lang="scss" scoped></style>
