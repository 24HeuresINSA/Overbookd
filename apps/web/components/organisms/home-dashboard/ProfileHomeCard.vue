<template>
  <v-card class="home-card profile">
    <v-btn
      class="profile__edit-icon"
      icon="mdi-pencil"
      aria-label="Éditer le profil"
      title="Éditer le profil"
      variant="text"
      rounded="pill"
      @click="editProfile"
    />

    <div class="profile__header">
      <div class="profile__picture">
        <ProfilePicture v-if="loggedUser" :user="loggedUser" size="large" />
      </div>
      <div class="profile__identity">
        <h2 class="identity__name">{{ name }}</h2>
        <p class="identity__full-name">{{ fullName }}</p>
        <div class="teams">
          <TeamChip v-for="team of teams" :key="team" :team="team" with-name />
        </div>
      </div>
    </div>

    <v-card-text class="profile__data">
      <div class="stats-container">
        <div class="stats">
          <span class="stats__value">{{ charisma }}</span>
          <span class="stats__label">
            {{ pluralize("Charisme", charisma) }}
          </span>
        </div>
        <div class="stats">
          <span class="stats__value">{{ friendCount }}</span>
          <span class="stats__label">
            {{ pluralize("Ami·e", friendCount, "·s") }}
          </span>
        </div>
        <div class="stats">
          <span class="stats__value">{{ tasksCount }}</span>
          <span class="stats__label">
            {{ pluralize("Tâche", tasksCount) }}
          </span>
        </div>
      </div>

      <div class="personal-info-container">
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

        <div class="personal-info personal-info--full">
          <v-icon class="personal-info__icon">mdi-comment-text</v-icon>
          <span
            class="personal-info__label"
            :class="{ 'personal-info__label--empty': !loggedUser?.comment }"
          >
            {{ loggedUser?.comment || "Aucun commentaire" }}
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
import { HARD } from "@overbookd/team-code";
import { nicknameOrFirstName, buildUserName } from "@overbookd/user";
import { assignmentPreferenceLabels } from "~/utils/assignment/preference";

const myStore = useMyStore();
const userStore = useUserStore();
const preferenceStore = usePreferenceStore();

userStore.fetchMyFriends();

const loggedUser = computed(() => myStore.loggedUser);

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
const friendCount = computed<number>(() => userStore.myFriends.length);
const tasksCount = computed<number>(() =>
  loggedUser.value ? loggedUser.value.tasksCount : 0,
);

const wantsPaperPlanning = computed<boolean>(
  () => preferenceStore.myPreferences.paperPlanning ?? false,
);

const isHard = computed<boolean>(() => myStore.isMemberOf(HARD));
const assignmentPreferenceLabel = computed<string>(() => {
  if (isHard.value) return assignmentPreferenceLabels.NO_REST;
  return assignmentPreferenceLabels[preferenceStore.myPreferences.assignment];
});

const isEditProfileDialogOpen = ref<boolean>(false);
const editProfile = () => (isEditProfileDialogOpen.value = true);
const closeEditProfileDialog = () => (isEditProfileDialogOpen.value = false);
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

.profile {
  container-type: inline-size;
  &__edit-icon {
    position: absolute;
    top: 4px;
    right: 4px;
    opacity: 0.8;
    z-index: 1;
  }
  &__header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px 48px 8px 20px;
  }
  &__picture {
    flex-shrink: 0;
    line-height: 0;
    :deep(.profile-picture__photo) {
      width: clamp(96px, 30cqi, 140px);
      height: clamp(96px, 30cqi, 140px);
    }
    :deep(.profile-picture__icon) {
      font-size: clamp(96px, 30cqi, 140px);
    }
  }
  &__identity {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    word-break: break-word;
  }
  &__data {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.identity {
  &__name {
    font-size: 1.6rem;
    line-height: 1.2;
  }
  &__full-name {
    font-size: 0.95rem;
    opacity: 0.7;
  }
}

.teams {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  .stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 8px 4px;
    border-radius: 12px;
    background: rgba(var(--v-theme-on-surface), 0.05);
    &__value {
      font-size: 1.4rem;
      font-weight: bold;
      line-height: 1.2;
    }
    &__label {
      font-size: 0.85rem;
      opacity: 0.7;
    }
  }
}

.personal-info-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px 16px;
  .personal-info {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    &__icon {
      font-size: 1.4rem;
      opacity: 0.7;
    }
    &__label {
      font-size: 0.9rem;
      word-break: break-word;
      &--empty {
        opacity: 0.5;
        font-style: italic;
      }
    }
  }
}

@container (min-width: 560px) {
  .personal-info-container {
    grid-template-columns: 1fr 1fr;
    .personal-info--full {
      grid-column: 1 / -1;
    }
  }
}

@container (max-width: 360px) {
  .profile__header {
    flex-direction: column;
    text-align: center;
    padding: 20px 16px 8px;
  }
  .teams {
    justify-content: center;
  }
}
</style>
