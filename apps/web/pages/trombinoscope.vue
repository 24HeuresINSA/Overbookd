<template>
  <div class="trombinoscope">
    <h1>Trombinoscope</h1>
    <div v-show="volunteersBornToday.length" class="birthdays">
      <BirthdayCard
        v-for="volunteer in volunteersBornToday"
        :key="volunteer.id"
        :volunteer="volunteer"
      />
    </div>
    <TrombinoscopeGroup
      heading="Conseil d'administration 🧑‍💼"
      :volunteers="orgas"
    />
    <TrombinoscopeGroup heading="Adhérents 🤡" :volunteers="adherents" />
    <TrombinoscopeGroup heading="Bénévoles 😎" :volunteers="eventVolunteers" />
    <TrombinoscopeGroup heading="EHPAD 🧓" :volunteers="seniors" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { UserPersonalData } from "@overbookd/user";
import BirthdayCard from "~/components/molecules/user/trombinoscope/BirthdayCard.vue";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";
import TrombinoscopeGroup from "~/components/molecules/user/trombinoscope/TrombinoscopeGroup.vue";

type Volunteer = UserPersonalData | UserPersonalDataWithProfilePicture;

export default Vue.extend({
  name: "Trombinoscope",
  components: { BirthdayCard, TrombinoscopeGroup },
  head: () => ({
    title: "Trombinoscope",
  }),
  computed: {
    volunteers(): Volunteer[] {
      return this.$accessor.user.volunteers;
    },
    orgas(): Volunteer[] {
      return this.volunteers.filter((volunteer) =>
        volunteer.teams.includes("orga"),
      );
    },
    adherents(): Volunteer[] {
      return this.volunteers.filter((volunteer) => {
        const notOrga = !volunteer.teams.includes("orga");
        const isHard = volunteer.teams.includes("hard");
        return notOrga && isHard;
      });
    },
    eventVolunteers(): Volunteer[] {
      return this.volunteers.filter((volunteer) =>
        volunteer.teams.includes("soft"),
      );
    },
    seniors(): Volunteer[] {
      return this.volunteers.filter((volunteer) => {
        const notHard = !volunteer.teams.includes("hard");
        const isSenior = volunteer.teams.includes("vieux");
        return notHard && isSenior;
      });
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
.trombinoscope {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.birthdays {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 350px));
  gap: 15px;
  align-items: stretch;
  justify-content: center;
  .contain-card {
    height: 100%;
    .trombinoscopeCard {
      height: 100%;
    }
  }
}
</style>
