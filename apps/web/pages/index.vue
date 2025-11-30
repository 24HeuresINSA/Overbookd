<template>
  <DesktopPageTitle :title="titleMessage" />
  <v-row class="home" no-gutters>
    <v-col class="home">
      <ToDoAsVolunteerHomeCard
        v-if="shouldDisplayInstructionsForVolunteer"
        class="mobile-only"
      />
      <PlanningDownloadHomeCard
        v-if="canDownloadAndSyncPlanning"
        class="mobile-only"
      />

      <ProfileHomeCard />
      <FriendsHomeCard v-if="isOrWantsToBeVolunteer === false" />
    </v-col>

    <v-col class="home">
      <PlanningDownloadHomeCard
        v-if="canDownloadAndSyncPlanning"
        class="desktop-only"
      />
      <ToDoAsVolunteerHomeCard
        v-if="shouldDisplayInstructionsForVolunteer"
        class="desktop-only"
      />
      <PersonalAccountHomeCard v-if="hasPersonalAccount" />
    </v-col>

    <v-col v-if="hasThirdColumn" class="home">
      <PersonalFtHomeCard v-if="canWriteFT" />
      <PersonalFaHomeCard v-if="canWriteFA" />
      <FriendsHomeCard v-if="isOrWantsToBeVolunteer" />
    </v-col>
  </v-row>
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
import { SOFT } from "@overbookd/team-constants";

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
const isOrWantsToBeVolunteer = computed<boolean | undefined>(() => {
  if (!me.value) return;
  const wantToBeVolunteer = me.value.membershipApplication === VOLUNTEER;
  const isVolunteer = me.value.teams.includes(SOFT);
  return wantToBeVolunteer || isVolunteer;
});
const shouldDisplayInstructionsForVolunteer = computed<boolean>(() => {
  const hasNoPlanning = !canDownloadAndSyncPlanning.value;
  return !!isOrWantsToBeVolunteer.value && hasNoPlanning;
});

const canWriteFA = computed<boolean>(() => userStore.can(WRITE_FA));
const canWriteFT = computed<boolean>(() => userStore.can(WRITE_FT));
const hasThirdColumn = computed<boolean>(
  () => canWriteFA.value || canWriteFT.value || !!isOrWantsToBeVolunteer.value,
);
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  flex-wrap: wrap;
  gap: $card-gap;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    gap: $card-gap;
  }
}
.v-col {
  align-self: flex-start;
}
</style>
