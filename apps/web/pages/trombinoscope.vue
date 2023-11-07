<template>
  <div>
    <v-container v-show="usersBornToday.length" class="userBornToday">
      <v-card
        v-for="userBornToday in usersBornToday"
        :key="userBornToday.id"
        class="userBornToday__card"
        color="#FFD700"
      >
        <v-card-title>
          <ProfilePicture :user="userBornToday" />
          <p>Joyeux anniv 🥳</p>
          <p>{{ formatUserNameWithNickname(userBornToday) }}</p>
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
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";

export default Vue.extend({
  name: "Trombinoscope",
  components: { TrombinoscopeCard, ProfilePicture },
  computed: {
    users() {
      return this.$accessor.user.users;
    },
    usersBornToday() {
      return this.$accessor.user.users.filter(
        (user: UserPersonalDataWithProfilePicture) => {
          const today = new Date();
          const birthdate = new Date(user.birthdate);
          return (
            birthdate.getDate() === today.getDate() &&
            birthdate.getMonth() === today.getMonth()
          );
        },
      );
    },
  },
  created() {
    if (!this.users.length) this.$accessor.user.fetchUsers();
  },
  mounted() {
    this.usersBornToday.forEach((user: UserPersonalDataWithProfilePicture) => {
      this.$accessor.user.setProfilePicture(user);
    });
  },
  methods: {
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
  padding: 5px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  place-items: center;
  gap: 10px;

  &__card {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 350px;
    min-height: 100%;
    .userProfilePicture {
      max-height: 50%;
    }

    .defaultProfilePicture {
      justify-self: center;
    }
    .v-card__title {
      display: flex;
      justify-content: center;
      flex-direction: column;
      p {
        margin: 0;
      }
    }
  }
}

.trombinoscopeCard {
  margin: 5px;
  height: 300px;
}
</style>
