<template>
  <DialogCard :without-actions="!canManageUsers" @close="close">
    <template #title>
      <div class="card-title">
        <ProfilePicture :user="volunteer" class="profile-picture" />
        <h2>{{ buildUserNameWithNickname(volunteer) }}</h2>
      </div>
    </template>

    <template #content>
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
      <div v-if="canManageUsers" class="team-add">
        <SearchTeams
          v-model="newTeams"
          label="Choix de l'équipe"
          hide-details
          closable-chips
          :list="assignableTeams"
        />
        <v-btn
          icon="mdi-plus"
          :disabled="hasNotNewTeamToAdd"
          @click="addTeams"
        />
      </div>

      <v-text-field
        v-show="canManageUsers"
        v-model="nickname"
        label="Surnom"
        prepend-icon="mdi-account"
        :readonly="!canManageUsers"
      />

      <v-text-field
        v-model="charisma"
        type="number"
        label="Points de charisme"
        prepend-icon="mdi-emoticon-cool-outline"
        :rules="[rules.required, rules.number]"
        :disabled="!canManageUsers"
      />

      <v-text-field
        v-model="email"
        label="Email"
        inputmode="email"
        :rules="[rules.required, rules.email, rules.insaEmail]"
        persistent-hint
        :readonly="!canManageUsers"
        prepend-icon="mdi-send"
        @click:prepend="sendEmail"
      />

      <v-text-field
        v-model="phone"
        label="Numéro de téléphone"
        :readonly="!canManageUsers"
        :rules="[rules.required, rules.mobilePhone]"
        prepend-icon="mdi-phone"
        @click:prepend="callPhoneNumber"
      />

      <div>
        <h3>Commentaire</h3>
        <p>{{ volunteer.comment ?? "Aucun commentaire" }}</p>
      </div>

      <v-textarea
        v-show="canManageUsers"
        v-model="note"
        class="comment-input"
        label="Note des humains"
        rows="3"
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
      </div>

      <SearchFriend
        v-show="canManageUsers"
        v-model="newFriend"
        class="friend-search"
        @update:model-value="sendFriendRequest"
      />
    </template>

    <template #actions>
      <div class="action-btns">
        <v-btn
          text="Changer les infos personnelles"
          color="success"
          variant="elevated"
          size="large"
          @click="savePersonalData"
        />
        <v-btn
          v-if="!isMe"
          text="Supprimer le bénévole"
          color="red"
          variant="elevated"
          size="small"
          @click="deleteVolunteer"
        />
      </div>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import { MANAGE_ADMINS, MANAGE_USERS } from "@overbookd/permission";
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
  required,
} from "~/utils/rules/input.rules";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";
import { formatPhoneLink } from "~/utils/user/user.utils";

const userStore = useUserStore();
const teamStore = useTeamStore();
const authStore = useAuthStore();

const props = defineProps({
  volunteer: {
    type: Object as PropType<UserDataWithPotentialyProfilePicture>,
    required: true,
  },
});
const volunteerId = computed<number>(() => props.volunteer.id);

const nickname = ref<string | null>(null);
const phone = ref<string>("");
const email = ref<string>("");
const charisma = ref<number>(0);
const newTeams = ref<Team[]>([]);
const note = ref<string | null>(null);
const newFriend = ref<User | null>(null);

const rules = {
  required,
  email: isEmail,
  insaEmail: isInsaEmail,
  mobilePhone: isMobilePhoneNumber,
  number: isNumber,
};

const selectedVolunteerFriends = computed<User[]>(
  () => userStore.selectedUserFriends,
);
const canManageUsers = computed<boolean>(() => userStore.can(MANAGE_USERS));
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

const updateVolunteerInformations = async () => {
  nickname.value = props.volunteer.nickname ?? null;
  phone.value = props.volunteer.phone ?? "";
  email.value = props.volunteer.email ?? "";
  charisma.value = props.volunteer.charisma ?? 0;
  note.value = props.volunteer.note ?? null;

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
  authStore.refreshTokens();
};

const removeTeam = async (team: string) => {
  await userStore.removeTeamFromUser(volunteerId.value, team);
  await updateVolunteerInformations();
  authStore.refreshTokens();
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
  return {
    ...props.volunteer,
    nickname: nickname.value,
    phone: phone.value,
    email: email.value,
    charisma: +charisma.value,
    note: trimmedNote,
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
.card-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  @media only screen and (max-width: $mobile-max-width) {
    .profile-picture {
      max-width: 100px;
      max-height: 100px;
      font-size: 80px;
    }
  }
}

.team-list {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 10px;
  justify-content: center;
}

.team-add {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.friends {
  display: flex;
  flex-direction: column;
  gap: 5px;
  &__list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin: 0;
  }
}

.friend-search {
  margin-top: 10px;
  margin-left: 10px;
}

.action-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
