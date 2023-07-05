<template>
  <v-card class="profilePictureCard">
    <ProfilePicture :user="user" />
    <v-card-title>{{ formatUserNameWithNickname(user) }} </v-card-title>
    <v-card-subtitle>
      <TeamChip v-for="team of user.team" :key="team" :team="team" />
    </v-card-subtitle>
    <v-card-text class="comment">
      {{ user.comment }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import { CompleteUserWithPermissions } from "~/utils/models/user";
import { formatUserNameWithNickname } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "TrombinoscopeCard",
  components: { TeamChip, ProfilePicture },
  props: {
    user: { type: Object as () => CompleteUserWithPermissions, required: true },
  },
  methods: {
    formatUserNameWithNickname,
  },
});
</script>

<style lang="scss" scoped>
.comment {
  overflow-y: hidden;
}

.profilePictureCard {
  display: flex;
  flex-direction: column;
}
</style>
