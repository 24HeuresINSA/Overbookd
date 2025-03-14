<template>
  <DesktopPageTitle :title="titleMessage" />
  <v-container fluid>
    <v-row class="home" no-gutters>
      <v-col class="home">
        <ProfileHomeCard />
        <FriendsHomeCard v-if="!isOrWantsToBeVolunteer" />
      </v-col>

      <v-col class="home">
        <PlanningDownloadHomeCard v-if="canDownloadAndSyncPlanning" />
        <PersonalAccountHomeCard v-if="hasPersonalAccount" />
        <ToDoAsVolunteerHomeCard v-if="shouldDisplayInstructionsForVolunteer" />
      </v-col>

      <v-col v-if="hasThirdColumn" class="home">
        <PersonalFtHomeCard v-if="canWriteFT" />
        <PersonalFaHomeCard v-if="canWriteFA" />
        <FriendsHomeCard v-if="isOrWantsToBeVolunteer" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { nicknameOrFirstName } from "@overbookd/user";
import {
  DOWNLOAD_PLANNING,
  HAVE_PERSONAL_ACCOUNT,
  SYNC_PLANNING,
  WRITE_FA,
  WRITE_FT,
} from "@overbookd/permission";
import { OverDate } from "@overbookd/time";
import { VOLUNTEER } from "@overbookd/registration";
import { SOFT_CODE } from "@overbookd/team-constants";

const userStore = useUserStore();

const me = computed(() => userStore.loggedUser);

const displayedName = computed<string>(() =>
  me.value ? nicknameOrFirstName(me.value) : "",
);

const isBirthdayToday = computed<boolean>(() => {
  if (!me.value) return false;

  const today = OverDate.now();
  const birthday = OverDate.from(me.value.birthdate);

  return (
    today.monthlyDate.month === birthday.monthlyDate.month &&
    today.monthlyDate.day === birthday.monthlyDate.day
  );
});

const titleMessage = computed<string>(() => {
  const birtdayMessage = "Joyeux anniversaire 🎉🎂🥳";
  if (isBirthdayToday.value) return birtdayMessage;

  const defaultMessage = `Bienvenue ${displayedName.value} 👋`;
  const possibleMessages = [
    defaultMessage,
    `BONNNSOIIIIIIIR ${displayedName.value} !!! 🔊`,
    `Wassup ${displayedName.value} 👊`,
    `你好 ${displayedName.value} 🥟`,
    `Howdy ${displayedName.value} 🤠`,
    `Salut ${displayedName.value} 👋`,
    `Je s'appelle ${displayedName.value} 🌲`,
    `ボンジュール ${displayedName.value} 🥖`,
    `Hello ${displayedName.value} 👋`,
    `Bienvenue sur Overbookd ${displayedName.value} 👋`,
    `Mes plus sincères salutations ${displayedName.value} 🥸`,
    `Guten Abend ${displayedName.value} 🥨`,
    `おはよう ${displayedName.value} 🍜`,
  ];

  const randomIndex = Math.floor(Math.random() * possibleMessages.length);
  return possibleMessages.at(randomIndex) ?? defaultMessage;
});

const hasPersonalAccount = computed<boolean>(() =>
  userStore.can(HAVE_PERSONAL_ACCOUNT),
);
const canDownloadAndSyncPlanning = computed<boolean>(
  () => userStore.can(DOWNLOAD_PLANNING) && userStore.can(SYNC_PLANNING),
);
const isOrWantsToBeVolunteer = computed<boolean>(() => {
  if (!me.value) return false;
  const wantToBeVolunteer = me.value.membershipApplication === VOLUNTEER;
  const isVolunteer = me.value.teams.includes(SOFT_CODE);
  return wantToBeVolunteer || isVolunteer;
});
const shouldDisplayInstructionsForVolunteer = computed<boolean>(() => {
  const hasNoPlanning = !canDownloadAndSyncPlanning.value;
  return isOrWantsToBeVolunteer.value && hasNoPlanning;
});

const canWriteFA = computed<boolean>(() => userStore.can(WRITE_FA));
const canWriteFT = computed<boolean>(() => userStore.can(WRITE_FT));
const hasThirdColumn = computed<boolean>(
  () => canWriteFA.value || canWriteFT.value || isOrWantsToBeVolunteer.value,
);
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-wrap: wrap;
  gap: $card-gap;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    gap: $card-gap;
  }
}
.v-col {
  align-self: flex-start;
}
</style>
