<template>
  <div>
    <v-container v-show="usersBornToday.length" class="userBornToday">
      <v-card
        v-for="userBornToday in usersBornToday"
        :key="userBornToday.id"
        class="userBornToday__card"
        color="#FFD700"
      >
        <ProfilePicture :user="userBornToday" />
        <v-card-title>
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
import { UserPersonnalData } from "@overbookd/user";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";

export default Vue.extend({
  name: "Trombinoscope",
  components: { TrombinoscopeCard, ProfilePicture },
  computed: {
    users() {
      return this.$accessor.user.users;
    },
    usersBornToday() {
      return this.$accessor.user.users.filter((user: UserPersonnalData) => {
        const today = new Date();
        const birthdate = new Date(user.birthdate);
        return (
          birthdate.getDate() === today.getDate() &&
          birthdate.getMonth() === today.getMonth()
        );
      });
    },
  },
  created() {
    if (!this.users.length) this.$accessor.user.fetchUsers();
  },
  mounted() {
    this.usersBornToday.forEach((user: UserPersonnalData) => {
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
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.userBornToday__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 5px;
  width: 15%;
  height: 80%;

  .userProfilePicture {
    max-height: 50%;
  }

  .defaultProfilePicture {
    justify-self: center;
  }
  .v-card__title {
    flex-grow: 1;
    justify-self: flex-end;
    p {
      margin: 0;
    }
  }
}

.trombinoscopeCard {
  margin: 5px;
  height: 300px;
}
</style>
