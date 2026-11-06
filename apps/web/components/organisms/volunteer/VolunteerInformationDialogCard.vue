<template>
  <DialogCard without-actions @close="close">
    <template #content>
      <div class="volunteer-content">
        <div class="volunteer-informations">
          <div class="card-title">
            <ProfilePicture
              size="large"
              :user="volunteer"
              class="profile-picture"
            />
            <h2>{{ buildUserNameWithNickname(volunteer) }}</h2>
          </div>
          <div class="charisma">
            Charisme: <strong>{{ volunteer.charisma }}</strong> 😎
            <span v-if="canViewPlanning"> | </span>
            <v-btn
              v-if="canViewPlanning"
              prepend-icon="mdi-calendar-blank-multiple"
              color="primary"
              size="small"
              text="Voir le planning"
              @click="openCalendar(volunteer.id)"
            />
          </div>
          <div class="team-list">
            <TeamChip
              v-for="team in volunteer.teams"
              :key="team"
              :team="team"
              with-name
              :show-hidden="canManageUsers"
              :closable="canManageUsers && isTeamManageable(team)"
              @close="removeTeam"
            />
          </div>
          <div class="volunteer-form">
            <div v-if="canManageUsers" class="team-add">
              <SearchTeams
                v-model="newTeams"
                label="Equipe à ajouter"
                prepend-icon="mdi-account-group"
                hide-details
                closable-chips
                :exclude="[...NON_MANAGEABLE_TEAMS, ...volunteer.teams]"
              />
              <v-btn
                icon="mdi-plus"
                aria-label="Ajouter les équipes"
                title="Ajouter les équipes"
                :disabled="hasNotNewTeamToAdd"
                color="primary"
                @click="addTeams"
              />
            </div>

            <v-text-field
              v-if="canManageUsers"
              v-model="nickname"
              label="Surnom"
              :rules="[rules.maxLength(30)]"
              prepend-icon="mdi-account"
              hide-details="auto"
              clearable
            />

            <v-text-field
              v-model="birthDay"
              label="Date de naissance"
              type="date"
              :rules="[rules.required, rules.minDate, rules.maxDate]"
              :readonly="!canManageUsers"
              prepend-icon="mdi-calendar"
              class="birth-date"
              :class="{ 'birth-date__minor-hint': shouldDisplayMinorHint }"
              :hint="
                shouldDisplayMinorHint ? 'Sera mineur·e à la manif' : undefined
              "
              :persistent-hint="shouldDisplayMinorHint"
              hide-details="auto"
            />

            <v-text-field
              v-model="email"
              label="Email"
              inputmode="email"
              :rules="[rules.required, rules.email, rules.insaEmail]"
              :readonly="!canManageUsers"
              prepend-icon="mdi-send"
              persistent-hint
              hide-details="auto"
              @click:prepend="sendEmail"
            />

            <v-text-field
              v-model="phoneNumber"
              label="Numéro de téléphone"
              :readonly="!canManageUsers"
              :rules="[rules.required, rules.mobilePhone]"
              prepend-icon="mdi-phone"
              hide-details="auto"
              @click:prepend="callPhoneNumber"
            />
            <div v-if="canManageUsers" class="preference">
              <v-icon class="preference__icon">
                mdi-calendar-blank-multiple
              </v-icon>
              <span class="preference__label">
                {{ assignmentPreferenceLabel }}
              </span>
            </div>

            <div>
              <h3>Commentaire</h3>
              <p>{{ volunteer.comment || "Aucun commentaire" }}</p>
            </div>

            <v-textarea
              v-if="canManageUsers"
              v-model="note"
              label="Note des humains"
              rows="3"
              hide-details
            />

            <div class="friends">
              <h3>Amis</h3>
              <div class="friends__list">
                <v-chip
                  v-for="friend in selectedVolunteerFriends"
                  :key="friend.id"
                  v-tooltip:top="
                    canManageUsers && isCandidate(friend)
                      ? 'N\'est pas encore enrolé·e'
                      : ''
                  "
                  :closable="canManageUsers"
                  :color="
                    canManageUsers && isCandidate(friend)
                      ? 'warning'
                      : undefined
                  "
                  @click:close="removeFriend(friend)"
                >
                  {{ buildUserName(friend) }}
                </v-chip>
                <span v-if="selectedVolunteerFriends.length === 0">
                  Aucun·e ami·e
                </span>
              </div>
              <SearchFriend
                v-if="canManageUsers"
                v-model="newFriend"
                :volunteer="volunteer"
                title="Ajouter un·e ami·e"
                class="friends__input"
                hide-details
                @update:model-value="sendFriendRequest"
              />
            </div>
          </div>
          <div v-if="canManageUsers" class="action-btns">
            <v-btn
              text="Enregistrer les informations"
              color="success"
              size="large"
              :loading="isLoading"
              @click="savePersonalData"
            />
            <v-btn
              v-if="!isMe && showDeleteButton"
              text="Supprimer le bénévole"
              color="red"
              size="small"
              @click="deleteOrAnonymizeVolunteer"
            />
            <slot name="additional-actions" />
          </div>
        </div>
        <AvailabilitiesSumupCalendar
          v-if="canManageAvailabilities"
          v-model="availabilities as Availabilities"
          :loading="isLoading"
          class="availabilities desktop-only"
        />
      </div>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import {
  AFFECT_VOLUNTEER,
  MANAGE_USERS,
  VIEW_PLANNING,
} from "@overbookd/permission";
import {
  type User,
  type UserPersonalData,
  type UserUpdateForm,
  type UserWithTeams,
  buildUserName,
  buildUserNameWithNickname,
} from "@overbookd/user";
import {
  isEmail,
  isInsaEmail,
  isMobilePhoneNumber,
  isNumber,
  maxDate,
  maxLength,
  minDate,
  required,
} from "~/utils/rules/input.rules";
import { formatLocalDate, type IProvidePeriod, Period } from "@overbookd/time";
import { HARD, PERSONNE } from "@overbookd/team-code";
import { assignmentPreferenceLabels } from "~/utils/assignment/preference";
import { PLANNING_URL } from "@overbookd/web-page";
import {
  formatEmailLink,
  formatPhoneLink,
  formatPhoneNumberToInternational,
} from "@overbookd/registration";
import {
  NON_MANAGEABLE_TEAMS,
  isTeamManageable,
} from "@overbookd/access-manager";
import { willBeMinorAtEvent } from "~/utils/user/minor-volunteer";
import { Availabilities } from "@overbookd/volunteer-availability";

const myStore = useMyStore();
const userStore = useUserStore();
const availabilityStore = useVolunteerAvailabilityStore();

const { volunteer } = defineProps({
  volunteer: {
    type: Object as PropType<UserPersonalData>,
    required: true,
  },
  showDeleteButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  "close",
  "update-teams",
  "update-friends",
  "update-availabilities",
  "updated",
  "delete",
  "anonymize",
]);

const rules = {
  required,
  email: isEmail,
  insaEmail: isInsaEmail,
  mobilePhone: isMobilePhoneNumber,
  number: isNumber,
  maxLength,
  minDate: minDate(new Date("1950-01-01")),
  maxDate: maxDate(),
};

const isLoading = ref<boolean>(false);

const nickname = ref<string | null>(null);
const birthDay = ref<string>("");
const phoneNumber = ref<string>("");
const email = ref<string>("");
const note = ref<string | null>(null);
const newTeams = ref<Team[]>([]);
const newFriend = ref<User | null>(null);

const availabilities = ref<Availabilities>(Availabilities.init());
const savedAvailabilities = ref<Period[]>([]);

const canManageUsers = computed<boolean>(() => myStore.can(MANAGE_USERS));
const canViewPlanning = computed<boolean>(() => myStore.can(VIEW_PLANNING));
const canManageAvailabilities = computed<boolean>(() =>
  myStore.can(AFFECT_VOLUNTEER),
);
const isMe = computed<boolean>(() => myStore.loggedUser?.id === volunteer.id);

const isHard = computed<boolean>(() => volunteer.teams.includes(HARD));
const assignmentPreferenceLabel = computed<string>(() => {
  const assignment = volunteer.preference?.assignment;
  if (isHard.value) return assignmentPreferenceLabels.NO_REST;
  if (!assignment) return assignmentPreferenceLabels.NO_PREF;
  return assignmentPreferenceLabels[assignment];
});
const shouldDisplayMinorHint = computed<boolean>(
  () =>
    myStore.can(AFFECT_VOLUNTEER) &&
    willBeMinorAtEvent(new Date(birthDay.value)),
);

const selectedVolunteerFriends = computed<UserWithTeams[]>(
  () => userStore.selectedUserFriends,
);
const isCandidate = (volunteer: UserWithTeams) =>
  !volunteer.teams.includes(PERSONNE);

const fillVolunteerInformations = async () => {
  nickname.value = volunteer.nickname ?? null;
  birthDay.value = formatLocalDate(volunteer.birthDate);
  phoneNumber.value = volunteer.phoneNumber ?? "";
  email.value = volunteer.email ?? "";
  note.value = volunteer.note ?? null;
  await userStore.fetchSelectedUserFriends();
};
const fetchAvailabilities = async () => {
  if (!canManageAvailabilities.value) return;
  availabilityStore.clearVolunteerAvailabilities();
  await availabilityStore.fetchVolunteerAvailabilities(volunteer.id);
  const fetchedPeriods = availabilityStore.availabilities.list as Period[];
  availabilities.value = Availabilities.init({ selected: fetchedPeriods });
  savedAvailabilities.value = fetchedPeriods;
};

watch(
  () => volunteer,
  async () => {
    isLoading.value = true;
    await Promise.all([fillVolunteerInformations(), fetchAvailabilities()]);
    isLoading.value = false;
  },
  { immediate: true },
);

const hasNotNewTeamToAdd = computed<boolean>(() => newTeams.value.length === 0);
const addTeams = async () => {
  if (hasNotNewTeamToAdd.value) return;
  const teams = newTeams.value.map((team) => team.code);
  await userStore.addTeamsToUser(volunteer.id, teams);
  await fillVolunteerInformations();
  newTeams.value = [];
  emit("update-teams");
};
const removeTeam = async (team: string) => {
  await userStore.removeTeamFromUser(volunteer.id, team);
  await fillVolunteerInformations();
  emit("update-teams");
};

const sendFriendRequest = async () => {
  if (newFriend.value === null || volunteer.id === newFriend.value.id) return;
  await userStore.addFriendToUser(volunteer.id, newFriend.value);
  newFriend.value = null;
  emit("update-friends");
};
const removeFriend = async (friend: User) => {
  await userStore.removeFriendFromUser(volunteer.id, friend);
  emit("update-friends");
};

const trimOrNull = (value?: string | null): string | null =>
  value?.trim() || null;

const updatedVolunteer = computed<UserUpdateForm>(() => ({
  firstName: volunteer.firstName,
  lastName: volunteer.lastName,
  nickname: trimOrNull(nickname.value),
  birthDate: new Date(birthDay.value),
  phoneNumber: formatPhoneNumberToInternational(phoneNumber.value),
  email: email.value.trim(),
  note: trimOrNull(note.value),
}));
const isUserInformationUnchanged = computed<boolean>(() => {
  const updated = updatedVolunteer.value;
  return (
    updated.nickname === trimOrNull(volunteer.nickname) &&
    birthDay.value === formatLocalDate(volunteer.birthDate) &&
    updated.phoneNumber === volunteer.phoneNumber &&
    updated.email === volunteer.email &&
    updated.note === trimOrNull(volunteer.note)
  );
});

const isSamePeriod = (first: IProvidePeriod, second: IProvidePeriod) =>
  first.start.getTime() === second.start.getTime() &&
  first.end.getTime() === second.end.getTime();
const isAvailabilitiesUnchanged = computed<boolean>(() => {
  const saved = savedAvailabilities.value;
  const selected = availabilities.value.selected;
  if (saved.length !== selected.length) return false;
  return saved.every((savedPeriod) =>
    selected.some((selectedPeriod) =>
      isSamePeriod(savedPeriod, selectedPeriod),
    ),
  );
});

const saveUserInformation = async () => {
  if (isUserInformationUnchanged.value) return;
  await userStore.updateUser(volunteer.id, updatedVolunteer.value);
};
const saveAvailabilities = async () => {
  if (!canManageAvailabilities.value || isAvailabilitiesUnchanged.value) return;
  await availabilityStore.overrideVolunteerAvailabilities(
    volunteer.id,
    availabilities.value.selected as Period[],
  );
  emit("update-availabilities");
};
const savePersonalData = async () => {
  isLoading.value = true;
  try {
    await Promise.all([saveUserInformation(), saveAvailabilities()]);
    emit("updated");
  } finally {
    isLoading.value = false;
  }
};

const close = () => emit("close");
const deleteOrAnonymizeVolunteer = async () => {
  const shouldAnonymize = await userStore.shouldAnonymizeUser(volunteer.id);
  emit(shouldAnonymize ? "anonymize" : "delete");
};
const sendEmail = () => {
  window.location.href = formatEmailLink(volunteer.email);
};
const callPhoneNumber = () => {
  window.location.href = formatPhoneLink(volunteer.phoneNumber);
};
const openCalendar = (volunteerId: number) => {
  window.open(`${PLANNING_URL}/${volunteerId}`);
};
</script>

<style lang="scss" scoped>
.calendar-button {
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.volunteer-content {
  display: flex;
  gap: 20px;
  .volunteer-calendar {
    font-size: 1.1rem;
    margin-left: 20px;
  }
  .volunteer-informations {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .availabilities {
    flex: 2;
  }
}

.card-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  h2 {
    font-size: 2em;
    line-height: 1.1;
    margin-bottom: 5px;
  }
  .profile-picture {
    max-width: 160px;
    max-height: 160px;
    font-size: 120px;
  }
  @media screen and (max-width: $mobile-max-width) {
    .profile-picture {
      max-width: 100px;
      max-height: 100px;
      font-size: 80px;
    }
  }
}

.charisma {
  text-align: center;
  font-size: 1em;
}

.team-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  margin-top: 5px;
}

.team-add {
  display: flex;
  align-items: center;
  gap: 10px;
}

.volunteer-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
}

.birth-date__minor-hint {
  :deep(.v-messages__message) {
    color: rgb(var(--v-theme-error));
  }
}

.preference {
  display: flex;
  align-items: center;
  gap: 22px;
  &__icon {
    font-size: 1.6rem;
  }
  &__label {
    font-size: 1.1rem;
    word-break: break-word;
  }
}

.friends {
  display: flex;
  flex-direction: column;
  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin: 0;
  }
  &__input {
    margin-top: 15px;
  }
}

.action-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
