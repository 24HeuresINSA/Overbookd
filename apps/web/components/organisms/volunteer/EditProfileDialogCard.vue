<template>
  <DialogCard @close="close">
    <template #title>Modifier mon profil</template>
    <template #content>
      <v-file-input
        v-model="profilePicture"
        :rules="[isImage, isSupportedImageFile, isImageSizeWithinLimit]"
        label="Photo de profil"
        prepend-icon="mdi-camera"
        accept="image/png, image/jpeg, image/gif"
        show-size
      />
      <v-form v-model="isFormValid" class="profile-form">
        <div class="profile-row">
          <v-text-field
            v-model="firstname"
            label="Prénom*"
            :rules="[required, maxLength(30)]"
          />
          <v-text-field
            v-model="lastname"
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
            v-model="birthday"
            label="Date de naissance*"
            type="date"
            :rules="[required, minDateRule, maxDateRule]"
          />
        </div>
        <div class="profile-row">
          <v-text-field
            v-model="phone"
            label="Téléphone portable*"
            :rules="[required, isMobilePhoneNumber]"
          />
          <v-text-field
            v-tooltip:top="
              'Tu dois passer par les responsables bénévoles ou le.a secrétaire général.e pour changer ton email 🙏'
            "
            :model-value="email"
            label="Email*"
            readonly
          />
        </div>
        <div class="planning-preference">
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
          <p class="planning-preference__label">
            Je souhaite avoir une version imprimée de mon planning
          </p>

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
import { assignmentPreferences, type Preference } from "@overbookd/http";
import { formatLocalDate } from "@overbookd/time";
import {
  required,
  isMobilePhoneNumber,
  isImage,
  isImageSizeWithinLimit,
  isSupportedImageFile,
  minDate,
  maxDate,
  maxLength,
} from "~/utils/rules/input.rules";

const userStore = useUserStore();
const preferenceStore = usePreferenceStore();

const loggedUser = computed(() => userStore.loggedUser);

const profilePicture = ref<File | undefined>();

const firstname = ref<string>(loggedUser.value?.firstname ?? "");
const lastname = ref<string>(loggedUser.value?.lastname ?? "");
const nickname = ref<string | null | undefined>(loggedUser.value?.nickname);
const birthday = ref<string>(
  loggedUser.value ? formatLocalDate(loggedUser.value.birthdate) : "",
);
const email = computed<string>(() => loggedUser.value?.email ?? "");
const phone = ref<string>(loggedUser.value?.phone ?? "");
const preferences = computed<Preference>(() => preferenceStore.myPreferences);
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

const updateAssignmentPreference = (assignment: string) => {
  if (!assignmentPreferences.includes(assignment)) return;
  preferenceStore.updateAssignmentPreference({
    assignment: assignment as Preference["assignment"],
  });
};

const save = async () => {
  if (!isFormValid.value) return;
  loading.value = true;

  const newProfileData = {
    firstname: firstname.value,
    lastname: lastname.value,
    nickname: nickname.value?.trim() ? nickname.value : null,
    birthdate: new Date(birthday.value),
    phone: phone.value,
    comment: comment.value ? comment.value : null,
  };
  await userStore.updateMyProfile(newProfileData);

  if (profilePicture.value !== undefined) {
    const profilePictureForm = new FormData();
    profilePictureForm.append(
      "file",
      profilePicture.value,
      profilePicture.value.name,
    );
    await userStore.addProfilePicture(profilePictureForm);
    userStore.setMyProfilePicture();
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

.profile-row {
  display: flex;
  gap: 20px;
  .v-text-field {
    flex: 1;
  }
  @media only screen and (max-width: $mobile-max-width) {
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
</style>
