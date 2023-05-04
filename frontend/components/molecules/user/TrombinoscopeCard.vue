<template>
  <v-card style="margin: 5px" max-width="250px">
    <v-img
      v-if="hasProfilePicture(user)"
      :src="user.profilePictureBlob"
      max-height="250px"
    />
    <v-card-title
      >{{ user.firstname }} {{ user.lastname }} ({{ user.nickname }})
    </v-card-title>
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

export default Vue.extend({
  name: "TrombinoscopeCard",
  components: { OverChips },
  props: {
    user: { type: Object as () => CompleteUserWithPermissions, required: true },
  },
  created() {
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
  },
});
</script>

<style lang="scss" scoped></style>
