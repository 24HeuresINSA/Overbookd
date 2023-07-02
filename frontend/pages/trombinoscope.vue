<template>
  <div>
    <v-container
      v-if="userBornToday"
      style="display: flex; justify-content: center"
    >
      <v-card color="#FFD700" class="userBornToday">
        <v-img
          v-show="hasProfilePicture(userBornToday)"
          :src="userBornToday.profilePictureBlob"
        ></v-img>
        <v-card-title>
          Joyeux anniv 🥳
          {{ formatUserNameWithNickname(userBornToday) }}
        </v-card-title>
      </v-card>
    </v-container>
    <div class="volunteers">
      <div v-for="user in users" :key="user.id">
        <v-sheet min-height="250">
          <v-lazy>
            <TrombinoscopeCard :user="user" class="trombinoscopeCard" />
          </v-lazy>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TrombinoscopeCard from "~/components/molecules/user/TrombinoscopeCard.vue";
import { CompleteUserWithPermissions } from "~/utils/models/user";
import { formatUserNameWithNickname } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "Trombinoscope",
  components: { TrombinoscopeCard },
  computed: {
    users() {
      return this.$accessor.user.users;
    },
    userBornToday() {
      return this.$accessor.user.users.find(
        (user: CompleteUserWithPermissions) => {
          const today = new Date();
          const birthdate = new Date(user.birthdate);
          return (
            birthdate.getDate() === today.getDate() &&
            birthdate.getMonth() === today.getMonth()
          );
        }
      );
    },
  },
  created() {
    if (!this.users.length) this.$accessor.user.fetchUsers();
  },
  methods: {
    hasProfilePicture(user: CompleteUserWithPermissions): boolean {
      return user.profilePicture !== null;
    },
    formatUserNameWithNickname,
  },
});
</script>

<style lang="scss" scoped>
.volunteers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.userBornToday {
  max-width: 400px;
  max-height: 400px;
}

.trombinoscopeCard {
  margin: 5px;
  height: 300px;
}
</style>
