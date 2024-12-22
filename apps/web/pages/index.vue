<template>
  <DesktopPageTitle :title="titleMessage" />
  <div class="home">
    <ProfileHomeCard />
    <PersonalAccountHomeCard v-if="hasPersonalAccount" />
    <PersonalFaHomeCard v-if="hasPersonalFA" />
  </div>
</template>

<script lang="ts" setup>
import { nicknameOrFirstName } from "@overbookd/user";
import { HAVE_PERSONAL_ACCOUNT, WRITE_FA } from "@overbookd/permission";
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
const hasPersonalFA = computed<boolean>(() => userStore.can(WRITE_FA));
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
