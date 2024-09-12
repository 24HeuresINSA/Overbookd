<template>
  <div class="user-card">
    <ProfilePictureDialog v-model="isProfilePictureDialogOpen" />
    <v-card>
      <v-card-text v-if="loggedUser" class="user-card__content">
        <div class="picture">
          <ProfilePicture
            size="large"
            :user="loggedUser"
            class="profile-picture"
          />
          <v-btn
            :text="`📸 ${loggedUser.profilePicture ? 'Changer' : 'Ajouter'}`"
            color="primary"
            @click="isProfilePictureDialogOpen = true"
          />
        </div>
        <v-form class="identity">
          <v-text-field
            v-model="firstname"
            prepend-icon="mdi-account"
            label="Prénom"
            required
            :rules="[rules.required]"
            @input="defectSave"
          />
          <v-text-field
            v-model="lastname"
            prepend-icon="mdi-account"
            label="Nom"
            required
            :rules="[rules.required]"
            @input="defectSave"
          />
          <v-text-field
            v-model="nickname"
            prepend-icon="mdi-account"
            label="Surnom"
            hide-details
            clearable
            @click:clear="clearNickname"
            @input="defectSave"
          />
        </v-form>
        <div class="team-and-stats">
          <div class="teams">
            <TeamChip
              v-for="team of loggedUser.teams"
              :key="team"
              :team="team"
              with-name
            />
          </div>
          <p>
            <v-icon>{{ charismaIcon }}</v-icon>
            {{ loggedUser.charisma }} points de charisme
          </p>
          <p><v-icon>mdi-account-multiple</v-icon> {{ friendsCount }} amis</p>
          <p>
            <v-icon>mdi-account-hard-hat</v-icon>
            {{ loggedUser.tasksCount }} tâches affectées
          </p>
          <v-card class="planning-preference" outlined>
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
          </v-card>
        </div>
        <v-form class="personal-information">
          <v-text-field
            v-model="phone"
            prepend-icon="mdi-phone"
            label="Téléphone portable"
            :rules="[rules.required, rules.mobilePhone]"
            @input="defectSave"
          />
          <v-text-field
            v-model="birthday"
            prepend-icon="mdi-cake-variant"
            label="Date de naissance*"
            type="date"
            :rules="[
              rules.required,
              rules.birthdayMaxDate,
              rules.birthdayMinDate,
            ]"
            @input="defectSave"
          />
          <v-text-field
            v-model="email"
            prepend-icon="mdi-email-outline"
            label="Email"
            name="email"
            autocomplete="email"
            inputmode="email"
            readonly
            hint="Pour changer ton email il faut passer par les responsables bénévoles ou le.a secrétaire général.e. 🙏"
            persistent-hint
            @input="defectSave"
          />
        </v-form>
        <CommentField
          v-model="comment"
          class="comment"
          @update:model-value="defectSave"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { Preference } from "@overbookd/http";
import {
  isMobilePhoneNumber,
  maxDate,
  minDate,
  required,
} from "~/utils/rules/input.rules";
import { formatLocalDate } from "@overbookd/time";
import { EVIL, EVIL_CHARISMA, COOL } from "~/utils/easter-egg/evil-charisma";

const userStore = useUserStore();
const preferenceStore = usePreferenceStore();

userStore.setMyProfilePicture();
preferenceStore.fetchMyPreferences();

const loggedUser = computed(() => userStore.loggedUser);
const friendsCount = computed<number>(() => userStore.mFriends.length);
const preferences = computed<Preference>(() => preferenceStore.myPreferences);
const hasFilledPreferences = computed<boolean>(
  () =>
    preferences.value?.paperPlanning !== undefined &&
    preferences.value?.paperPlanning !== null,
);
const charismaIcon = computed<string>(() =>
  loggedUser.value?.charisma === EVIL_CHARISMA ? EVIL.icon : COOL.icon,
);

const firstname = ref<string>(loggedUser.value?.firstname ?? "");
const lastname = ref<string>(loggedUser.value?.lastname ?? "");
const nickname = ref<string | null | undefined>(loggedUser.value?.nickname);
const birthday = ref<string>(
  loggedUser.value ? formatLocalDate(loggedUser.value.birthdate) : "",
);
const email = ref<string>(loggedUser.value?.email ?? "");
const phone = ref<string>(loggedUser.value?.phone ?? "");
const comment = ref<string | null | undefined>(loggedUser.value?.comment);

const delay = ref<ReturnType<typeof setTimeout> | undefined>(undefined);
const isProfilePictureDialogOpen = ref<boolean>(false);

const rules = {
  required,
  birthdayMinDate: minDate(new Date("1950-01-01")),
  birthdayMaxDate: maxDate(),
  mobilePhone: isMobilePhoneNumber,
};

const isValid = (): boolean => {
  const isValidFirstname = rules.required(firstname.value) === true;
  const isValidLastname = rules.required(lastname.value) === true;
  const isValidBirthdate = [
    rules.required(birthday.value),
    rules.birthdayMinDate(birthday.value),
    rules.birthdayMaxDate(birthday.value),
  ].every((rule) => rule === true);
  const isValidPhone = [
    rules.required(phone.value),
    rules.mobilePhone(phone.value),
  ].every((rule) => rule === true);

  return (
    isValidFirstname && isValidLastname && isValidBirthdate && isValidPhone
  );
};
const defectSave = () => {
  if (delay.value) clearInterval(delay.value);
  if (!isValid()) return;
  delay.value = setTimeout(save, 800);
};
const save = () => {
  const myInfo = {
    firstname: firstname.value,
    lastname: lastname.value,
    nickname: nickname.value ? nickname.value : null,
    birthdate: new Date(birthday.value),
    email: email.value,
    phone: phone.value,
    comment: comment.value ? comment.value : null,
  };
  userStore.updateMyProfile(myInfo);
};
const clearNickname = () => {
  nickname.value = null;
  save();
};
const updatePaperPlanningPreference = (paperPlanning: boolean | null) => {
  if (paperPlanning === null) return;
  preferenceStore.updatePlanningPreference({ paperPlanning });
};
</script>

<style scoped lang="scss">
.user-card {
  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 10px;
    row-gap: 15px;
    > * {
      justify-self: center;
      align-self: center;
    }
    .picture {
      grid-column: 1 / span 1;
      grid-row: 1 / span 1;
    }
    .identity {
      grid-column: 3 / span 1;
      grid-row: 1 / span 1;
    }
    .team-and-stats {
      grid-column: 2 / span 1;
      grid-row-start: 1 / span 1;
      .teams,
      > p {
        margin-bottom: 16px;
      }
    }
    .personal-information {
      grid-column: 3 / span 1;
      grid-row: 2 / span 1;
    }
    .comment {
      grid-column: 1 / span 2;
      grid-row: 2 / span 1;
    }
    @media only screen and (max-width: $mobile-max-width) {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      gap: 10px;
      > * {
        align-self: unset;
      }
    }
    form {
      min-width: 100%;
    }
    .picture {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: center;
      gap: 2px;
      @media only screen and (min-width: $mobile-max-width) {
        width: 50%;
      }
    }
  }
}
.profile-picture {
  margin-bottom: 15px;
}
.planning-preference {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  &__label {
    margin: 0 10px;
  }
  .v-btn-group {
    flex-shrink: 0;
  }
}
</style>
