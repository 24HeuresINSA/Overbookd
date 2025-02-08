<template>
  <div class="profile">
    <div class="profile__header" @click="handleProfileClick">
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

    <v-dialog
      v-if="isMobile"
      v-model="isMenuOpen"
      max-width="300"
      transition="dialog-bottom-transition"
    >
      <v-card>
        <div class="mobile_menu">
          <div class="mobile_menu__item" @click="toggleCurrentTheme">
            <v-icon>{{ themeIcon }}</v-icon>
            <span>{{ themeTitle }}</span>
          </div>
          <div class="mobile_menu__item" @click="displayEULA">
            <v-icon>mdi-book-open-variant-outline</v-icon>
            <span>Voir les CGU</span>
          </div>
          <div class="mobile_menu__item" @click="openQuestionDialog">
            <v-icon>mdi-help-circle-outline</v-icon>
            <span>Besoin d'aide ?</span>
          </div>
          <div class="mobile_menu__item logout" @click="logout">
            <v-icon>mdi-close-circle-outline</v-icon>
            <span>Déconnexion</span>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <div v-if="!isMobile" class="dropdown-container">
      <div class="dropdown-menu">
        <div class="dropdown-menu__item" @click="toggleCurrentTheme">
          <v-icon>{{ themeIcon }}</v-icon>
          <span>{{ themeTitle }}</span>
        </div>
        <div class="dropdown-menu__item" @click="displayEULA">
          <v-icon>mdi-book-open-variant-outline</v-icon>
          <span>Voir les CGU</span>
        </div>
        <div class="dropdown-menu__item logout" @click="logout">
          <v-icon>mdi-close-circle-outline</v-icon>
          <span>Déconnexion</span>
        </div>
      </div>
    </div>

    <v-dialog
      v-model="isEULADialogOpen"
      transition="dialog-bottom-transition"
      fullscreen
    >
      <EULADialogCard @close="closeEULA" />
    </v-dialog>

    <v-dialog v-model="isQuestionDialogOpen" max-width="600">
      <AskQuestionDialogCard @close="closeQuestionDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { nicknameOrFirstName } from "@overbookd/user";
import { HAVE_PERSONAL_ACCOUNT } from "@overbookd/permission";
import { Money } from "@overbookd/money";
import { useTheme } from "vuetify";
import { pickReverseTheme } from "~/utils/vuetify/theme/theme.utils";
import { navigateTo } from "#app";
import { LOGIN_URL } from "@overbookd/web-page";

const theme = useTheme();
const layoutStore = useLayoutStore();
const authStore = useAuthStore();
const userStore = useUserStore();

const isMobile = computed<boolean>(() => layoutStore.isMobile);
const isMenuOpen = ref<boolean>(false);

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
  isMenuOpen.value = false;
  authStore.logout();
  await navigateTo(LOGIN_URL);
  userStore.clearLoggedUser();
};

const isDarkTheme = computed<boolean>(() => layoutStore.isDarkTheme);
const themeTitle = computed<string>(() =>
  isDarkTheme.value ? "Mode Jour" : "Mode Nuit",
);
const themeIcon = computed<string>(() =>
  isDarkTheme.value ? "mdi-weather-sunny" : "mdi-weather-night",
);
const toggleCurrentTheme = () => {
  isMenuOpen.value = false;
  layoutStore.toggleTheme();

  const currentTheme = theme.global.name.value;
  theme.global.name.value = pickReverseTheme(currentTheme);
};

const isEULADialogOpen = ref<boolean>(false);
const displayEULA = () => {
  isMenuOpen.value = false;
  isEULADialogOpen.value = true;
};
const closeEULA = () => (isEULADialogOpen.value = false);

const isQuestionDialogOpen = ref<boolean>(false);
const openQuestionDialog = () => {
  isMenuOpen.value = false;
  isQuestionDialogOpen.value = true;
};
const closeQuestionDialog = () => (isQuestionDialogOpen.value = false);

const handleProfileClick = () => {
  if (isMobile) {
    isMenuOpen.value = !isMenuOpen.value;
  }
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
    align-items: center;
    margin-right: 20px;
    max-width: $header-profile-max-width;
    height: 100%;
    cursor: pointer;
    @media only screen and (max-width: $mobile-max-width) {
      min-width: unset;
      margin-right: 5px;
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

  &:hover {
    .dropdown-container {
      display: block;

      .dropdown-menu {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
    }
  }

  &:hover .extend-icon {
    transform: rotate(180deg);
  }
}

.mobile_menu {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__item {
    margin: 5px 0;
    border-radius: 15px;
    background-color: rgb(var(--v-theme-background));
    transition: background-color 0.1s ease;
    display: flex;
    align-items: center;
    gap: 15px;
    font-size: 1rem;
    font-weight: 600;
    padding: 15px 20px 15px 20px;

    &:hover {
      background-color: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }

    span {
      font-weight: 600;
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

.dropdown-container {
  position: fixed;
  top: 100%;
  right: 0;
  display: none;
}

.dropdown-menu {
  min-width: $header-profile-min-width;
  max-width: $header-profile-max-width;
  padding: 2px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: 0 0 10px 10px;
  align-items: center;
  animation: dropdown 0.3s ease forwards;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  pointer-events: none;

  &__item {
    display: flex;
    width: 80%;
    gap: 10px;
    align-items: center;
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    border-radius: 30px;
    padding: 6.5px;
    background-color: rgb(var(--v-theme-background));
    transition: background-color 0.1s ease;

    &:hover {
      background-color: rgb(var(--v-theme-primary));
      color: rgb(var(--v-theme-on-primary));
    }
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
