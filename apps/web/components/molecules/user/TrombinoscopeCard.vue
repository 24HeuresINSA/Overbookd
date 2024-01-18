<template>
  <v-card class="profilePictureCard">
    <v-card-title class="name-with-picture">
      <ProfilePicture :user="volunteer" />
      <span class="name">{{ formatUserNameWithNickname(volunteer) }}</span>
    </v-card-title>
    <v-card-subtitle>
      <div class="teams">
        <TeamChip v-for="team of volunteer.teams" :key="team" :team="team" />
      </div>
    </v-card-subtitle>
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
    volunteer: {
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
.name {
  font-size: 1.1rem;
  text-wrap: pretty;
}

.teams {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
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
