<template>
  <div>
    <v-container
      v-show="volunteersBornToday.length"
      class="volunteer-born-today"
    >
      <v-card
        v-for="volunteer in volunteersBornToday"
        :key="volunteer.id"
        class="volunteer-born-today__card"
        color="#FFD700"
      >
        <v-card-title>
          <ProfilePicture :user="volunteer" />
          <p>Joyeux anniv 🥳</p>
          <p>{{ formatUserNameWithNickname(volunteer) }}</p>
        </v-card-title>
      </v-card>
    </v-container>
    <div class="volunteers">
      <div v-for="volunteer in volunteers" :key="volunteer.id">
        <v-sheet min-height="250">
          <v-lazy>
            <TrombinoscopeCard
              :volunteer="volunteer"
              class="trombinoscopeCard"
            />
          </v-lazy>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { UserPersonalData } from "@overbookd/user";
import TrombinoscopeCard from "~/components/molecules/user/TrombinoscopeCard.vue";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";

type Volunteer = UserPersonalData | UserPersonalDataWithProfilePicture;

export default Vue.extend({
  name: "Trombinoscope",
  components: { TrombinoscopeCard, ProfilePicture },
  computed: {
    volunteers(): Volunteer[] {
      return this.$accessor.user.volunteers;
    },
    volunteersBornToday(): Volunteer[] {
      return this.volunteers.filter((volunteer) => {
        const today = new Date();
        const birthdate = new Date(volunteer.birthdate);
        return (
          birthdate.getDate() === today.getDate() &&
          birthdate.getMonth() === today.getMonth()
        );
      });
    },
  },
  async mounted() {
    await this.$accessor.user.fetchVolunteers();
    this.volunteersBornToday.forEach(
      (user: UserPersonalDataWithProfilePicture) => {
        this.$accessor.user.setProfilePicture(user);
      },
    );
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

.volunteer-born-today {
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
