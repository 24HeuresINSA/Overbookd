<template>
  <DialogCard @close="close">
    <template #title>Modifier mon profil</template>
    <template #content>
      <v-form v-model="isFormValid" class="profile-form">
        <div class="profile-identity">
          <div class="profile-picture">
            <img
              v-if="picturePreview"
              :src="picturePreview"
              alt="Photo de profil"
              class="profile-picture__photo"
            />
            <v-icon
              v-else
              icon="mdi-account-circle"
              class="profile-picture__icon"
            />
            <v-file-input
              v-model="profilePicture"
              :rules="[isSupportedImageFile, isImageSizeWithinLimit]"
              label="Changer la photo"
              prepend-icon=""
              prepend-inner-icon="mdi-camera"
              :accept="IMAGE_EXTENSIONS"
              density="compact"
              hide-details="auto"
              class="profile-picture__input"
            />
          </div>
          <div class="profile-fields">
            <div class="profile-row">
              <v-text-field
                v-model="firstName"
                label="Prénom*"
                :rules="[required, maxLength(30)]"
              />
              <v-text-field
                v-model="lastName"
                label="Nom*"
                :rules="[required, maxLength(30)]"
              />
            </div>
            <div class="profile-row">
              <v-text-field
                v-model="nickname"
                label="Surnom"
                :rules="[maxLength(30)]"
                clearable
              />
              <v-text-field
                v-model="birthDay"
                label="Date de naissance*"
                type="date"
                :rules="[required, minDateRule, maxDateRule]"
              />
            </div>
            <div class="profile-row">
              <v-text-field
                v-model="phoneNumber"
                label="Téléphone portable*"
                :rules="[required, isMobilePhoneNumber]"
              />
              <v-text-field
                v-tooltip:top="
                  'Tu dois passer par les responsables bénévoles ou le·a secrétaire général·e pour changer ton email 🙏'
                "
                :model-value="email"
                label="Email*"
                readonly
              />
            </div>
          </div>
        </div>
        <v-divider class="my-2" />
        <div class="planning-preference">
          <p class="planning-preference__label">
            Je souhaite avoir une version imprimée de mon planning :
          </p>
          <v-btn-toggle
            :model-value="preferences?.paperPlanning"
            color="primary"
            group
            :mandatory="hasFilledPreferences"
            @update:model-value="updatePaperPlanningPreference"
          >
            <v-btn :value="true"> <strong>OUI</strong> </v-btn>
            <v-btn :value="false"> <strong>NON</strong> </v-btn>
          </v-btn-toggle>
        </div>
        <div class="assignment-preference">
          <p class="assignment-preference__label">
            Le type de planning que je souhaite avoir :
          </p>
          <v-radio-group
            v-model="selectedAssignment"
            @update:model-value="updateAssignmentPreference"
          >
            <v-hover
              v-for="assignmentType of assignmentPreferences"
              :key="assignmentType"
            >
              <template #default="{ isHovering, props }">
                <v-radio
                  v-bind="props"
                  :label="
                    isHard && isHovering
                      ? assignmentPreferenceDetailedLabels.NO_REST
                      : selectableAssignmentPreferenceLabels[assignmentType]
                  "
                  :value="assignmentType"
                />
              </template>
            </v-hover>
          </v-radio-group>
        </div>
        <CommentField v-model="comment" />
      </v-form>
    </template>

    <template #actions>
      <v-btn
        text="Enregistrer les modifications"
        color="primary"
        size="large"
        :loading="loading"
        :disabled="!isFormValid"
        @click="save"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { useObjectUrl } from "@vueuse/core";
import { IMAGE_EXTENSIONS, type Preference } from "@overbookd/http";
import {
  assignmentPreferences,
  NO_PREF,
  isAssignmentPreference,
  type AssignmentPreferenceType,
} from "@overbookd/preference";
import { formatPhoneNumberToInternational } from "@overbookd/registration";
import { HARD } from "@overbookd/team-code";
import { formatLocalDate } from "@overbookd/time";
import { assignmentPreferenceDetailedLabels } from "~/utils/assignment/preference";
import {
  required,
  isMobilePhoneNumber,
  isImageSizeWithinLimit,
  isSupportedImageFile,
  minDate,
  maxDate,
  maxLength,
} from "~/utils/rules/input.rules";

const myStore = useMyStore();
const preferenceStore = usePreferenceStore();

const loggedUser = computed(() => myStore.loggedUser);

const profilePicture = ref<File | null>(null);
const selectedPictureUrl = useObjectUrl(profilePicture);
const picturePreview = computed<string | null | undefined>(
  () => selectedPictureUrl.value ?? loggedUser.value?.profilePicture,
);

const firstName = ref<string>(loggedUser.value?.firstName ?? "");
const lastName = ref<string>(loggedUser.value?.lastName ?? "");
const nickname = ref<string | null | undefined>(loggedUser.value?.nickname);
const birthDay = ref<string>(
  loggedUser.value ? formatLocalDate(loggedUser.value.birthDate) : "",
);
const email = computed<string>(() => loggedUser.value?.email ?? "");
const phoneNumber = ref<string>(loggedUser.value?.phoneNumber ?? "");
const preferences = computed<Preference>(() => preferenceStore.myPreferences);
const selectedAssignment = ref<AssignmentPreferenceType>(
  preferences.value?.assignment ?? NO_PREF,
);
const hasFilledPreferences = computed<boolean>(
  () =>
    preferences.value?.paperPlanning !== undefined &&
    preferences.value?.paperPlanning !== null,
);
const comment = ref<string | null | undefined>(loggedUser.value?.comment);

const minDateRule = minDate(new Date("1950-01-01"));
const maxDateRule = maxDate();

const emit = defineEmits(["close"]);
const close = () => emit("close");

const isFormValid = ref<boolean>(false);
const loading = ref<boolean>(false);

const updatePaperPlanningPreference = (paperPlanning: boolean | null) => {
  if (paperPlanning === null) return;
  preferenceStore.updatePlanningPreference({ paperPlanning });
};

const isHard = computed<boolean>(() => myStore.isMemberOf(HARD));
const selectableAssignmentPreferenceLabels = computed<
  Record<AssignmentPreferenceType, string>
>(() => {
  const labels = { ...assignmentPreferenceDetailedLabels };
  if (isHard.value) {
    labels.NO_REST =
      assignmentPreferenceDetailedLabels[selectedAssignment.value];
    labels[selectedAssignment.value] =
      assignmentPreferenceDetailedLabels.NO_REST;
  }
  return labels;
});

const updateAssignmentPreference = (assignment: string | null) => {
  if (assignment === null || !isAssignmentPreference(assignment)) return;
  preferenceStore.updateAssignmentPreference({ assignment });
};

const save = async () => {
  if (!isFormValid.value) return;
  loading.value = true;

  const newProfileData = {
    firstName: firstName.value,
    lastName: lastName.value,
    nickname: nickname.value?.trim() ? nickname.value : null,
    birthDate: new Date(birthDay.value),
    phoneNumber: formatPhoneNumberToInternational(phoneNumber.value),
    comment: comment.value ? comment.value : null,
  };
  await myStore.updateMyProfile(newProfileData);

  const image = profilePicture.value;
  if (image) {
    const profilePictureForm = new FormData();
    profilePictureForm.append("file", image, image.name);
    await myStore.updateMyProfilePicture(profilePictureForm);
  }

  loading.value = false;
  close();
};
</script>

<style lang="scss" scoped>
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.profile-identity {
  display: flex;
  gap: 24px;
  align-items: flex-start;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
}

.profile-picture {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 180px;
  flex-shrink: 0;
  &__photo {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
  }
  &__icon {
    font-size: 150px;
    opacity: 0.8;
  }
  &__input {
    width: 100%;
  }
}

.profile-fields {
  flex: 1;
  min-width: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.profile-row {
  display: flex;
  gap: 20px;
  .v-text-field {
    flex: 1;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    gap: 5px;
  }
}
.planning-preference {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  &__label {
    margin: 0 10px;
  }
  .v-btn-group {
    flex-shrink: 0;
    display: flex;
    gap: 5px;
    .v-btn {
      background-color: rgba(var(--v-theme-primary), 0.2);
    }
  }
}

.assignment-preference {
  margin-bottom: 5px;
  &__label {
    margin: 0 10px;
  }
  .v-radio {
    margin-left: 15px;
    width: fit-content;
  }
}
</style>
