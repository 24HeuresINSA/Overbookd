<template>
  <div>
    <div v-show="volunteersBornToday.length" class="volunteers">
      <BirthdayCard
        v-for="volunteer in volunteersBornToday"
        :key="volunteer.id"
        :volunteer="volunteer"
      />
    </div>
    <div class="volunteers">
      <div v-for="volunteer in volunteers" :key="volunteer.id">
        <v-sheet min-height="250" class="contain-card">
          <v-lazy class="contain-card">
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
import BirthdayCard from "~/components/molecules/user/BirthdayCard.vue";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";

type Volunteer = UserPersonalData | UserPersonalDataWithProfilePicture;

export default Vue.extend({
  name: "Trombinoscope",
  components: { TrombinoscopeCard, BirthdayCard },
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  align-items: stretch;
  .contain-card {
    height: 100%;
    .trombinoscopeCard {
      height: 100%;
    }
  }
}
</style>
