<template>
  <DesktopPageTitle :title="titleMessage" />
  <v-container fluid>
    <v-row class="home" no-gutters>
      <v-col class="home">
        <ProfileHomeCard />
      </v-col>
      <v-col v-if="hasPersonalAccount" class="home">
        <PersonalAccountHomeCard />
        <FriendsCard />
      </v-col>
      <v-col v-if="canWriteFA || canWriteFT" class="home">
        <PersonalFtHomeCard v-if="canWriteFT" />
        <PersonalFaHomeCard v-if="canWriteFA" />
      </v-col>
      <v-col v-if="! hasPersonalAccount" class="home">
        <FriendsCard v-if="! hasPersonalAccount" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { nicknameOrFirstName } from "@overbookd/user";
import {
  HAVE_PERSONAL_ACCOUNT,
  WRITE_FA,
  WRITE_FT,
} from "@overbookd/permission";
import { OverDate } from "@overbookd/time";

const userStore = useUserStore();

const displayedName = computed<string>(() =>
  userStore.loggedUser ? nicknameOrFirstName(userStore.loggedUser) : "",
);

const isBirthdayToday = computed<boolean>(() => {
  if (!userStore.loggedUser) return false;

  const today = OverDate.now();
  const birthday = OverDate.from(userStore.loggedUser.birthdate);

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

const canWriteFA = computed<boolean>(() => userStore.can(WRITE_FA));

const canWriteFT = computed<boolean>(() => userStore.can(WRITE_FT));

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
