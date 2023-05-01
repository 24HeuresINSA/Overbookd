<template>
  <div>
    <v-container
      v-if="userBornToday"
      style="display: flex; justify-content: center"
    >
      <v-card color="#FFD700" max-width="400px" max-height="400px">
        <v-img
          v-show="hasProfilePicture(userBornToday)"
          :src="userBornToday.profilePicture"
          max-width="400px"
          max-height="350px"
        ></v-img>
        <v-card-title>
          Joyeux anniv 🥳
          {{ userBornToday.firstname }}
          {{ userBornToday.lastname }} ({{ userBornToday.nickname }})
        </v-card-title>
      </v-card>
    </v-container>
    <v-container
      style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      "
    >
      <v-card
        v-for="user in users"
        :key="user.id"
        style="margin: 5px"
        max-width="250px"
      >
        <v-lazy>
          <v-img
            v-if="hasProfilePicture(user)"
            :src="user.profilePicture"
            max-height="250px"
          />
        </v-lazy>
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
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import OverChips from "~/components/atoms/chip/OverChips.vue";
import { CompleteUserWithPermissions } from "~/utils/models/user";

export default Vue.extend({
  name: "Trombinoscope",
  components: { OverChips },

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

  async mounted() {
    if (!this.$accessor.user.users.length) this.$accessor.user.fetchUsers();
  },

  methods: {
    hasProfilePicture(user: CompleteUserWithPermissions): boolean {
      if (!user.profilePicture) return false;
      if (user.profilePicture.includes("blob")) return true;
      const token = this.$auth.strategy.token.get();
      this.$accessor.user.getProfilePicture({ token, userId: user.id });
      return true;
    },
  },
});
</script>

<style scoped></style>
