<template>
  <v-card-title class="card-title">
    <ProfilePicture :user="volunteer" class="profile-picture" />
    <h2>{{ formatVolunteerNameWithNickname }}</h2>
  </v-card-title>

  <v-card-text class="card-content">
    <div>
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
        <v-btn small class="mx-2" @click="addTeams">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
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
          {{ formatUsername(friend) }}
        </v-chip>
        <span v-show="selectedVolunteerFriends.length === 0"> Aucun ami </span>
      </div>
    </div>

    <SearchFriend
      v-show="canManageUsers"
      v-model="newFriend"
      class="friend-search"
      @update:model-value="sendFriendRequest"
    />
  </v-card-text>

  <v-card-actions v-if="canManageUsers" class="action-btns">
    <v-btn color="success" @click="savePersonalData">
      changer les infos personnelles
    </v-btn>
    <v-btn v-if="!isMe" color="red" @click="deleteVolunteer"> supprimer </v-btn>
  </v-card-actions>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/http";
import { MANAGE_ADMINS, MANAGE_USERS } from "@overbookd/permission";
import type { User } from "@overbookd/user";
import {
  isEmail,
  isInsaEmail,
  isMobilePhoneNumber,
  isNumber,
  required,
} from "~/utils/rules/input.rules";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";
import {
  formatPhoneLink,
  formatUsername,
  formatUserNameWithNickname,
} from "~/utils/user/user.utils";

const userStore = useUserStore();
const teamStore = useTeamStore();
const authStore = useAuthStore();

const emit = defineEmits(["updated"]);

const { volunteer } = defineProps({
  volunteer: {
    type: Object as PropType<UserDataWithPotentialyProfilePicture>,
    required: true,
  },
});

const nickname = ref<string | null>(null);
const phone = ref("");
const email = ref("");
const charisma = ref(0);
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

const selectedVolunteerFriends = computed(() => userStore.selectedUserFriends);
const me = computed(() => userStore.me);
const canManageUsers = computed(() => userStore.can(MANAGE_USERS));
const userName = computed(() => ({
  firstname: volunteer.firstname,
  lastname: volunteer.lastname,
  nickname: volunteer.nickname,
}));
const formatVolunteerNameWithNickname = computed(() =>
  formatUserNameWithNickname(userName.value),
);
const isMe = computed(() => me.value.id === volunteer.id);
const assignableTeams = computed(() => {
  const teamsToAdd = teamStore.teams.filter(
    (team: Team) => !volunteer.teams?.includes(team.code),
  );
  if (userStore.can(MANAGE_ADMINS)) return teamsToAdd;
  return teamsToAdd.filter((team: Team) => team.code !== "admin");
});

const updateVolunteerInformations = async () => {
  nickname.value = volunteer.nickname ?? null;
  phone.value = volunteer.phone ?? "";
  email.value = volunteer.email ?? "";
  charisma.value = volunteer.charisma ?? 0;
  note.value = volunteer.note ?? null;

  if (volunteer.profilePictureBlob) return;
  await userStore.setSelectedUserProfilePicture();
};

watch(
  volunteer,
  async () => {
    await updateVolunteerInformations();
  },
  { immediate: true },
);

const addTeams = async () => {
  if (!newTeams.value) return;
  await userStore.addTeamsToSelectedUser(
    newTeams.value.map((team) => team.code),
  );
  await authStore.refreshTokens();
  await updateVolunteerInformations();
  newTeams.value = [];
};

const removeTeam = async (team: string) => {
  await userStore.removeTeamFromSelectedUser(team);
  await authStore.refreshTokens();
  await updateVolunteerInformations();
};

const sendFriendRequest = async () => {
  if (newFriend.value === null || volunteer.id === newFriend.value.id) return;
  await userStore.addFriendToSelectedUser(newFriend.value);
  newFriend.value = null;
};

const removeFriend = (friend: User) => {
  userStore.removeFriendFromSelectedUser(friend);
};

const updatedVolunteer = computed(() => {
  const trimmedNote = note.value?.trim() || null;
  return {
    ...volunteer,
    nickname: nickname.value,
    phone: phone.value,
    email: email.value,
    charisma: +charisma.value,
    note: trimmedNote,
  };
});

const savePersonalData = async () => {
  if (!volunteer) return;
  const id = volunteer.id;
  const user = updatedVolunteer.value;
  await userStore.updateUser(id, user);
  emit("updated");
};

const deleteVolunteer = async () => {
  await userStore.deleteUser(volunteer.id);
  emit("updated");
};

const sendEmail = () => {
  window.location.href = `mailto:${volunteer.email}`;
};

const callPhoneNumber = () => {
  window.location.href = formatPhoneLink(volunteer.phone);
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

.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 25px;
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
  margin-left: 10px;
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
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
