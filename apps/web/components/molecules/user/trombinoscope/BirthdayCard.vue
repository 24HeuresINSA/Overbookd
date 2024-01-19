<template>
  <v-card class="birthday-card" color="#FFD700">
    <v-card-title class="birthday-card__heading">
      <ProfilePicture :user="volunteer" />
      <p>Joyeux anniv 🥳</p>
      <p class="name">{{ formatUserNameWithNickname(volunteer) }}</p>
    </v-card-title>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";

export default Vue.extend({
  name: "TrombinoscopeCard",
  components: { ProfilePicture },
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
.birthday-card {
  display: flex;
  flex-direction: column;
  &__heading {
    display: flex;
    flex-direction: column;
    align-items: center;
    p {
      font-size: 1.1rem;
      text-wrap: pretty;
      margin: 0;
    }
  }
}
</style>
