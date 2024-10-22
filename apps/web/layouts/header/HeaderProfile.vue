<template>
  <div class="profile">
    <div class="profile__header">
      <div class="profile__data">
        <ProfilePicture
          v-if="loggedUser"
          :user="loggedUser"
          class="profile__picture"
          size="small"
        />
        <div class="profile__information">
          <span class="profile__name">{{ myName }}</span>
          <span class="profile__balance" :class="balanceClassColor">
            {{ displayedBalance }}
          </span>
        </div>
      </div>
      <v-icon class="extend-icon">mdi-chevron-down</v-icon>
    </div>

    <div class="dropdown-menu">
      <a class="dropdown-menu__item" @click="toggleCurrentTheme">
        <v-icon>{{ themeIcon }}</v-icon>
        {{ themeTitle }}
      </a>
      <a class="dropdown-menu__item logout" @click="logout">
        <v-icon>mdi-close-circle-outline</v-icon>
        Deconnexion
      </a>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nicknameOrFirstName } from "@overbookd/user";
import { HAVE_PERSONAL_ACCOUNT } from "@overbookd/permission";
import { Money } from "@overbookd/money";
import { LOGIN_URL } from "@overbookd/web-page";
import { useTheme } from "vuetify";
import { pickReverseTheme } from "~/utils/vuetify/theme/theme.utils";
import { navigateTo } from "#app";

const theme = useTheme();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const loggedUser = computed(() => userStore.loggedUser);
const myName = computed<string>(() =>
  loggedUser.value ? nicknameOrFirstName(loggedUser.value) : "",
);
const haveBalance = computed<boolean>(() =>
  userStore.can(HAVE_PERSONAL_ACCOUNT),
);
const myBalance = computed(() => loggedUser.value?.balance ?? 0);
const displayedBalance = computed<string>(() =>
  haveBalance.value ? Money.cents(myBalance.value).toString() : "",
);
const balanceClassColor = computed<string>(() => {
  if (myBalance.value < 0) return "negative";
  if (myBalance.value > 0) return "positive";
  return "";
});

const logout = async () => {
  authStore.logout();
  await navigateTo(LOGIN_URL);
  userStore.clearLoggedUser();
};

const isDarkTheme = computed<boolean>(() => themeStore.isDark);
const themeTitle = computed<string>(() =>
  isDarkTheme.value ? "Mode Jour" : "Mode Nuit",
);
const themeIcon = computed<string>(() =>
  isDarkTheme.value ? "mdi-weather-sunny" : "mdi-weather-night",
);
const toggleCurrentTheme = () => {
  themeStore.toggleTheme();

  const currentTheme = theme.global.name.value;
  theme.global.name.value = pickReverseTheme(currentTheme);
};
</script>

<style lang="scss" scoped>
$header-profile-min-width: 200px;
$header-profile-max-width: 300px;

.profile {
  position: relative;
  height: 100%;

  &__header {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    min-width: $header-profile-min-width;
    max-width: $header-profile-max-width;
    height: 100%;
    cursor: pointer;
    @media only screen and (max-width: $mobile-max-width) {
      min-width: unset;
    }
  }

  &__data {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  &__information {
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: $mobile-max-width) {
      display: none;
    }
  }
  &__name {
    font-size: 1rem;
    font-weight: 600;
    word-break: break-word;
    line-height: 1rem;
  }
  &__balance {
    font-size: 0.85rem;
    font-weight: 500;
  }
  .extend-icon {
    transition: transform 0.3s ease;
    @media only screen and (max-width: $mobile-max-width) {
      display: none;
    }
  }
  &:hover .extend-icon {
    transform: rotate(180deg);
  }
}

@media only screen and (min-width: $mobile-max-width) {
  .profile:hover .dropdown-menu {
    display: flex;
    animation: dropdown 0.3s ease forwards;
  }
}

.dropdown-menu {
  display: none;
  position: fixed;
  top: 100%;
  right: 0;
  min-width: $header-profile-min-width;
  max-width: $header-profile-max-width;
  padding: 2px 10px 10px 10px;
  flex-direction: column;
  gap: 5px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 0 0 10px 10px;
  align-items: center;
  opacity: 0;
  transform: translateY(-10px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  &__item {
    display: flex;
    width: 80%;
    gap: 10px;
    align-items: center;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    border-radius: 30px;
    padding: 4px;
    background-color: rgb(var(--v-theme-background));
    transition: background-color 0.1s ease;
    &:hover {
      background-color: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }
  }
}

@keyframes dropdown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.positive {
  color: rgb(var(--v-theme-success));
}
.negative,
.logout {
  color: rgb(var(--v-theme-error));
}
</style>
