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
          <p class="charisma">
            Charisme: <strong>{{ volunteer.charisma }}</strong> 😎
          </p>
          <div class="team-list">
            <TeamChip
              v-for="team in volunteer.teams"
              :key="team"
              :team="team"
              with-name
              :show-hidden="canManageUsers"
              :closable="canManageUsers"
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
                :list="assignableTeams"
              />
              <v-btn
                icon="mdi-plus"
                :disabled="hasNotNewTeamToAdd"
                color="primary"
                @click="addTeams"
              />
            </div>

            <v-text-field
              v-show="canManageUsers"
              v-model="nickname"
              label="Surnom"
              :rules="[rules.maxLength(30)]"
              :readonly="!canManageUsers"
              prepend-icon="mdi-account"
              hide-details
              clearable
            />

            <v-text-field
              v-model="birthday"
              label="Date de naissance"
              type="date"
              :rules="[rules.required, rules.minDate, rules.maxDate]"
              :readonly="!canManageUsers"
              prepend-icon="mdi-calendar"
              hide-details
            />

            <v-text-field
              v-model="email"
              label="Email"
              inputmode="email"
              :rules="[rules.required, rules.email, rules.insaEmail]"
              :readonly="!canManageUsers"
              prepend-icon="mdi-send"
              persistent-hint
              hide-details
              @click:prepend="sendEmail"
            />

            <v-text-field
              v-model="phone"
              label="Numéro de téléphone"
              :readonly="!canManageUsers"
              :rules="[rules.required, rules.mobilePhone]"
              prepend-icon="mdi-phone"
              hide-details
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
              v-show="canManageUsers"
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
                  :closable="canManageUsers"
                  @click:close="removeFriend(friend)"
                >
                  {{ buildUserName(friend) }}
                </v-chip>
                <span v-show="selectedVolunteerFriends.length === 0">
                  Aucun ami
                </span>
              </div>
              <SearchFriend
                v-show="canManageUsers"
                v-model="newFriend"
                title="Ajouter un ami"
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
              @click="savePersonalData"
            />
            <v-btn
              v-if="!isMe && !hideDeleteButton"
              text="Supprimer le bénévole"
              color="red"
              size="small"
              @click="deleteVolunteer"
            />
            <slot name="additional-actions" />
          </div>
        </div>
        <AvailabilitiesSumupCalendar
          v-if="canManageAvailabilities"
          :volunteer-id="volunteer.id"
          class="availabilitites desktop-only"
        />
      </div>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import {
  AFFECT_VOLUNTEER,
  MANAGE_ADMINS,
  MANAGE_USERS,
} from "@overbookd/permission";
import {
  type User,
  type UserPersonalData,
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
import { assignmentTypeLabel, type AssignmentType } from "@overbookd/http";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";
import { formatPhoneLink } from "~/utils/user/user.utils";
import { formatLocalDate } from "@overbookd/time";
import { HARD_CODE } from "@overbookd/team-constants";

const userStore = useUserStore();
const teamStore = useTeamStore();

const props = defineProps({
  volunteer: {
    type: Object as PropType<UserDataWithPotentialyProfilePicture>,
    required: true,
  },
  hideDeleteButton: {
    type: Boolean,
    default: false,
  },
});
const volunteerId = computed<number>(() => props.volunteer.id);

const nickname = ref<string | null>(null);
const birthday = ref<string>("");
const phone = ref<string>("");
const email = ref<string>("");
const newTeams = ref<Team[]>([]);
const note = ref<string | null>(null);
const newFriend = ref<User | null>(null);
const assignment = ref<AssignmentType | undefined>();

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

const selectedVolunteerFriends = computed<User[]>(
  () => userStore.selectedUserFriends,
);
const canManageUsers = computed<boolean>(() => userStore.can(MANAGE_USERS));
const canManageAvailabilities = computed<boolean>(() =>
  userStore.can(AFFECT_VOLUNTEER),
);
const isMe = computed<boolean>(
  () => userStore.loggedUser?.id === volunteerId.value,
);

const assignableTeams = computed<Team[]>(() => {
  const teamsToAdd = teamStore.teams.filter(
    (team: Team) => !props.volunteer.teams?.includes(team.code),
  );
  if (userStore.can(MANAGE_ADMINS)) return teamsToAdd;
  return teamsToAdd.filter((team: Team) => team.code !== "admin");
});

const isHard = computed<boolean>(() => userStore.isMemberOf(HARD_CODE));
const assignmentPreferenceLabel = computed<string>(() => {
  if (!assignment.value) return "";
  if (isHard.value) return assignmentTypeLabel.NO_REST;
  return assignmentTypeLabel[assignment.value];
});

const updateVolunteerInformations = async () => {
  nickname.value = props.volunteer.nickname ?? null;
  birthday.value = formatLocalDate(props.volunteer.birthdate);
  phone.value = props.volunteer.phone ?? "";
  email.value = props.volunteer.email ?? "";
  note.value = props.volunteer.note ?? null;
  assignment.value = props.volunteer.preference?.assignment;
  console.log(assignment.value, props.volunteer);
  await userStore.fetchSelectedUserFriends();

  if (props.volunteer.profilePictureBlob) return;
  await userStore.setSelectedUserProfilePicture();
};

watch(props.volunteer, async () => await updateVolunteerInformations(), {
  immediate: true,
});

const hasNotNewTeamToAdd = computed<boolean>(() => newTeams.value.length === 0);
const addTeams = async () => {
  if (hasNotNewTeamToAdd.value) return;
  const teams = newTeams.value.map((team) => team.code);
  await userStore.addTeamsToUser(volunteerId.value, teams);
  await updateVolunteerInformations();
  newTeams.value = [];
};

const removeTeam = async (team: string) => {
  await userStore.removeTeamFromUser(volunteerId.value, team);
  await updateVolunteerInformations();
};

const sendFriendRequest = () => {
  if (newFriend.value === null || volunteerId.value === newFriend.value.id) {
    return;
  }
  userStore.addFriendToUser(volunteerId.value, newFriend.value);
  newFriend.value = null;
};
const removeFriend = (friend: User) => {
  userStore.removeFriendFromUser(volunteerId.value, friend);
};

const updatedVolunteer = computed<UserPersonalData>(() => {
  const trimmedNote = note.value?.trim() || null;
  const trimmedComment = props.volunteer.comment?.trim() || null;
  return {
    ...props.volunteer,
    nickname: nickname.value,
    birthdate: new Date(birthday.value),
    phone: phone.value,
    email: email.value,
    note: trimmedNote,
    comment: trimmedComment,
  };
});

const emit = defineEmits(["close", "updated"]);
const close = () => emit("close");
const savePersonalData = async () => {
  await userStore.updateUser(volunteerId.value, updatedVolunteer.value);
  emit("updated");
};
const deleteVolunteer = async () => {
  await userStore.deleteUser(volunteerId.value);
  emit("updated");
};

const sendEmail = () => {
  window.location.href = `mailto:${props.volunteer.email}`;
};
const callPhoneNumber = () => {
  window.location.href = formatPhoneLink(props.volunteer.phone);
};
</script>

<style lang="scss" scoped>
.volunteer-content {
  display: flex;
  gap: 20px;
  .volunteer-informations {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .availabilitites {
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
  @media only screen and (max-width: $mobile-max-width) {
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
