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

<script lang="ts" setup>
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";

useHead({ title: "Trombinoscope" });

const userStore = useUserStore();

userStore.fetchVolunteers();

const volunteers = computed<UserDataWithPotentialyProfilePicture[]>(
  () => userStore.volunteers,
);
const orgas = computed<UserDataWithPotentialyProfilePicture[]>(() =>
  volunteers.value.filter((volunteer) => volunteer.teams.includes("orga")),
);
const adherents = computed<UserDataWithPotentialyProfilePicture[]>(() =>
  volunteers.value.filter((volunteer) => {
    const isNotOrga = !volunteer.teams.includes("orga");
    const isHard = volunteer.teams.includes("hard");
    return isNotOrga && isHard;
  }),
);
const eventVolunteers = computed<UserDataWithPotentialyProfilePicture[]>(() =>
  volunteers.value.filter((volunteer) => volunteer.teams.includes("soft")),
);
const seniors = computed<UserDataWithPotentialyProfilePicture[]>(() =>
  volunteers.value.filter((volunteer) => {
    const notHard = !volunteer.teams.includes("hard");
    const isSenior = volunteer.teams.includes("vieux");
    return notHard && isSenior;
  }),
);
const volunteersBornToday = computed<UserDataWithPotentialyProfilePicture[]>(
  () =>
    volunteers.value.filter((volunteer) => {
      const today = new Date();
      const birthdate = new Date(volunteer.birthdate);
      return (
        birthdate.getDate() === today.getDate() &&
        birthdate.getMonth() === today.getMonth()
      );
    }),
);
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
