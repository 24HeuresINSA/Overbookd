<template>
  <div>
    <!-- <v-container
      v-if="userBornToday"
      style="display: flex; justify-content: center"
    >
      <v-card color="#FFD700" max-width="400px" max-height="400px">
        <v-img
          v-show="hasProfilePicture(userBornToday)"
          :src="userBornToday.profilePictureBlob"
          max-width="400px"
          max-height="350px"
        ></v-img>
        <v-card-title>
          Joyeux anniv 🥳
          {{ userBornToday.firstname }}
          {{ userBornToday.lastname }} ({{ userBornToday.nickname }})
        </v-card-title>
      </v-card>
    </v-container> -->
    <div class="volunteers">
      <v-lazy v-for="user in users" :key="user.id">
        <TrombinoscopeCard :user="user" />
      </v-lazy>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TrombinoscopeCard from "~/components/molecules/user/TrombinoscopeCard.vue";
import { CompleteUserWithPermissions } from "~/utils/models/user";

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
          if (user.birthdate) {
            const today = new Date();
            const someDate = new Date(user.birthdate);
            return (
              someDate.getDate() === today.getDate() &&
              someDate.getMonth() === today.getMonth()
            );
          }
        }
      );
    },
  },
  created() {
    if (!this.users.length) this.$accessor.user.fetchUsers();
  },
});
</script>

<style scoped>
.volunteers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
</style>
