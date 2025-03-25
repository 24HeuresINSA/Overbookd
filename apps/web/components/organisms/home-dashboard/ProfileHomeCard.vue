<template>
  <v-card class="home-card profile">
    <v-btn
      class="profile__edit-icon"
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
      <div class="teams">
        <TeamChip v-for="team of teams" :key="team" :team="team" with-name />
      </div>

      <div class="stats-container">
        <div class="stats">
          <span class="stats__value">{{ charisma }}</span>
          <span class="stats__label">
            Charisme{{ additionalPlural(charisma) }}
          </span>
        </div>
        <div class="stats">
          <span class="stats__value">{{ friendsCount }}</span>
          <span class="stats__label">
            Ami{{ additionalPlural(friendsCount) }}
          </span>
        </div>
        <div class="stats">
          <span class="stats__value">{{ tasksCount }}</span>
          <span class="stats__label">
            Tâche{{ additionalPlural(tasksCount) }}
          </span>
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

        <div v-if="wantsPaperPlanning" class="personal-info">
          <v-icon class="personal-info__icon">mdi-notebook-check</v-icon>
          <span class="personal-info__label">
            Mon planning sera <strong>imprimé</strong>
          </span>
        </div>
        <div v-else class="personal-info">
          <v-icon class="personal-info__icon">mdi-cellphone</v-icon>
          <span class="personal-info__label">
            Mon planning sera <strong>uniquement</strong> disponible sur
            téléphone
          </span>
        </div>

        <div class="personal-info">
          <v-icon class="personal-info__icon">
            mdi-calendar-blank-multiple
          </v-icon>
          <span class="personal-info__label">
            {{ assignmentPreferenceLabel }}
          </span>
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
import { HARD_CODE } from "@overbookd/team-constants";
import { nicknameOrFirstName, buildUserName } from "@overbookd/user";
import {
  assignmentPreferenceDetailedLabels,
  assignmentPreferenceLabels,
} from "~/utils/assignment/preference";
import { formatUserPhone } from "~/utils/user/user.utils";

const userStore = useUserStore();
userStore.fetchMyFriends();
const preferenceStore = usePreferenceStore();

const loggedUser = computed(() => userStore.loggedUser);

const name = computed<string>(() =>
  loggedUser.value ? nicknameOrFirstName(loggedUser.value) : "",
);
const fullName = computed<string>(() =>
  loggedUser.value ? buildUserName(loggedUser.value) : "",
);
const teams = computed<string[]>(() => loggedUser.value?.teams ?? []);
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

const additionalPlural = (count: number) => {
  return count > 1 ? "s" : "";
};

const wantsPaperPlanning = computed<boolean>(
  () => preferenceStore.myPreferences.paperPlanning ?? false,
);

const isHard = computed<boolean>(() => userStore.isMemberOf(HARD_CODE));
const assignmentPreferenceLabel = computed<string>(() => {
  if (isHard.value) return assignmentPreferenceDetailedLabels.NO_REST;
  return assignmentPreferenceLabels[preferenceStore.myPreferences.assignment];
});

const isEditProfileDialogOpen = ref<boolean>(false);
const editProfile = () => (isEditProfileDialogOpen.value = true);
const closeEditProfileDialog = () => (isEditProfileDialogOpen.value = false);
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

.profile {
  &__edit-icon {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.8;
  }
  &__title {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    word-break: break-word;
    text-wrap: wrap;
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

.teams {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: center;
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
      word-break: break-word;
    }
  }
}
</style>
