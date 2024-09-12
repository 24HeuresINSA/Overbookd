<template>
  <v-card class="profile">
    <v-btn
      class="profile__edit"
      icon="mdi-pencil"
      variant="text"
      rounded="pill"
      @click="editProfile"
    />

    <v-card-title class="profile__title">
      <ProfilePicture
        v-if="loggedUser"
        :user="loggedUser"
        class="profile-picture"
      />
      <h2>{{ name }}</h2>
      <p class="title__full-name">{{ fullName }}</p>
    </v-card-title>

    <v-card-text class="profile__data">
      <div class="stats-container">
        <div class="stats">
          <span class="stats__value">{{ charisma }}</span>
          <span class="stats__label">Charisme</span>
        </div>
        <div class="stats">
          <span class="stats__value">{{ friendsCount }}</span>
          <span class="stats__label">Amis</span>
        </div>
        <div class="stats">
          <span class="stats__value">{{ tasksCount }}</span>
          <span class="stats__label">Tâches</span>
        </div>
      </div>
      <div class="personal-info-container">
        <div class="personal-info">
          <v-icon class="personal-info__icon">mdi-email</v-icon>
          <span class="personal-info__label">{{ loggedUser?.email }}</span>
        </div>
        <div class="personal-info">
          <v-icon class="personal-info__icon">mdi-phone</v-icon>
          <span class="personal-info__label">{{ phone }}</span>
        </div>
        <div class="personal-info">
          <v-icon class="personal-info__icon">mdi-comment-text</v-icon>
          <span class="personal-info__label">
            {{ loggedUser?.comment ?? "✖" }}
          </span>
        </div>
      </div>
    </v-card-text>

    <v-dialog v-model="isEditProfileDialogOpen" max-width="800px">
      <EditProfileDialogCard @close="closeEditProfileDialog" />
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import { nicknameOrFirstName, buildUserName } from "@overbookd/user";
import { formatUserPhone } from "~/utils/user/user.utils";

const userStore = useUserStore();
userStore.fetchMyFriends();

const loggedUser = computed(() => userStore.loggedUser);

const name = computed<string>(() =>
  loggedUser.value ? nicknameOrFirstName(loggedUser.value) : "",
);
const fullName = computed<string>(() =>
  loggedUser.value ? buildUserName(loggedUser.value) : "",
);
const charisma = computed<number>(() =>
  loggedUser.value ? loggedUser.value.charisma : 0,
);
const friendsCount = computed<number>(() => userStore.mFriends.length);
const tasksCount = computed<number>(() =>
  loggedUser.value ? loggedUser.value.tasksCount : 0,
);
const phone = computed<string>(() =>
  loggedUser.value ? formatUserPhone(loggedUser.value.phone) : "",
);

const isEditProfileDialogOpen = ref<boolean>(false);
const editProfile = () => (isEditProfileDialogOpen.value = true);
const closeEditProfileDialog = () => (isEditProfileDialogOpen.value = false);
</script>

<style lang="scss" scoped>
.profile {
  min-width: 250px;
  width: 25%;
  @media only screen and (max-width: $mobile-max-width) {
    min-width: unset;
    width: 100%;
  }
  &__edit {
    position: absolute;
    top: 0;
    right: 0;
  }
  &__title {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &__data {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 10px;
  }
}

.title__full-name {
  font-size: 1rem;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  gap: 10px;
  .stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    &__value {
      font-size: 1.4rem;
      font-weight: bold;
      line-height: 1.2;
    }
    &__label {
      font-size: 0.9rem;
      opacity: 0.7;
    }
  }
}

.personal-info-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0 5px;
  @media screen and (max-width: $mobile-max-width) {
    margin: 0;
  }
  .personal-info {
    display: flex;
    align-items: center;
    gap: 10px;
    &__icon {
      font-size: 1.5rem;
      opacity: 0.8;
    }
    &__label {
      font-size: 0.9rem;
    }
  }
}
</style>
