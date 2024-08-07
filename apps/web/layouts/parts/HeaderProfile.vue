<template>
  <div class="profile">
    <div class="profile__header">
      <div class="profile__data">
        <ProfilePicture
          v-if="loggedUser"
          :user="loggedUser"
          class="profile__picture"
          small
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
      <a class="dropdown-menu__item" @click="openProfile">
        <v-icon>mdi-account-outline</v-icon>
        Mon profil
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

const router = useRouter();
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

const openProfile = () => router.push("/profile");
const logout = async () => {
  authStore.logout();
  await router.push({ path: "/login" });
  userStore.clearLoggedUser();
};
</script>

<style lang="scss" scoped>
.profile {
  position: relative;

  &__header {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    min-width: 200px;
    max-width: 300px;
    height: 100%;
    cursor: pointer;
  }

  &__data {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  &__information {
    display: flex;
    flex-direction: column;
  }
  &__name {
    font-size: 1.1rem;
    font-weight: 600;
  }
  &__balance {
    font-size: 0.9rem;
    font-weight: 500;
  }
  .extend-icon {
    transition: transform 0.3s ease;
  }
  &:hover .extend-icon {
    transform: rotate(180deg);
  }
}

.profile:hover .dropdown-menu {
  display: flex;
  animation: dropdown 0.3s ease forwards;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  min-width: 200px;
  padding: 6px 10px 10px 10px;
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
      background-color: rgba(var(--v-theme-background), 0.6);
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
