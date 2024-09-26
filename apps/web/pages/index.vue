<template>
  <DesktopPageTitle :title="titleMessage" />
  <div class="home">
    <ProfileHomeCard />
    <PersonalAccountHomeCard />
  </div>
</template>

<script lang="ts" setup>
import { nicknameOrFirstName } from "@overbookd/user";

const userStore = useUserStore();

const displayedName = computed<string>(() =>
  userStore.loggedUser ? nicknameOrFirstName(userStore.loggedUser) : "",
);

const isBirthdayToday = computed<boolean>(() => {
  if (!userStore.loggedUser) return false;

  const today = new Date();
  const birthday = new Date(userStore.loggedUser.birthdate);

  const todaysDay = today.getDate();
  const todaysMonth = today.getMonth();
  const birthdaysDay = birthday.getDate();
  const birthdaysMonth = birthday.getMonth();

  return todaysDay === birthdaysDay && todaysMonth === birthdaysMonth;
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
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  gap: $card-gap;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}
</style>
