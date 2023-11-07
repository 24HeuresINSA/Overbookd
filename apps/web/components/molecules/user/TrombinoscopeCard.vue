<template>
  <v-card class="profilePictureCard">
    <v-card-title class="name-with-picture">
      <ProfilePicture :user="user" />
      {{ formatUserNameWithNickname(user) }}
    </v-card-title>
    <v-card-subtitle>
      <TeamChip v-for="team of user.teams" :key="team" :team="team" />
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
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";

export default Vue.extend({
  name: "TrombinoscopeCard",
  components: { TeamChip, ProfilePicture },
  props: {
    user: {
      type: Object as () => UserPersonalDataWithProfilePicture,
      required: true,
    },
  },
  methods: {
    formatUserNameWithNickname,
  },
});
</script>

<style lang="scss" scoped>
.comment {
  overflow-y: scroll;
}

.profilePictureCard {
  display: flex;
  flex-direction: column;
  .name-with-picture {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
