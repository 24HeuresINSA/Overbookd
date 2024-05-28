<template>
  <div>
    <v-card-title class="card-title">
      <ProfilePicture :user="selectedVolunteer" class="profile-picture" />
      <div v-show="canManageUsers">{{ formatVolunteerName }}</div>
      <div v-show="!canManageUsers">{{ formatVolunteerNameWithNickname }}</div>
    </v-card-title>

    <v-card-text class="card-content">
      <div>
        <div class="team-list">
          <TeamChip
            v-for="team of selectedVolunteer.teams"
            :key="team"
            :team="team"
            with-name
            :show-hidden="canManageUsers"
            :close="canManageUsers"
            @close="removeTeam"
          />
        </div>
        <div v-if="canManageUsers" class="team-add">
          <v-select
            v-model="newTeam"
            label="Choix de l'équipe"
            :items="assignableTeams"
            item-value="code"
            item-text="name"
          >
          </v-select>
          <v-btn small class="mx-2" @click="addTeam">
            <v-icon> mdi-plus </v-icon>
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
        <p>{{ selectedVolunteer.comment ?? "Aucun commentaire" }}</p>
      </div>

      <v-textarea
        v-show="canManageUsers"
        v-model="note"
        class="comment-input"
        label="Note des humains"
        rows="3"
      ></v-textarea>

      <div class="friends">
        <h3>Amis</h3>
        <div class="friends__list">
          <v-chip
            v-for="friend in selectedVolunteerFriends"
            :key="friend.id"
            :close="canManageUsers"
            @click:close="removeFriend(friend)"
          >
            {{ formatUserName(friend) }}
          </v-chip>
          <span v-show="selectedVolunteerFriends.length === 0">
            Aucun ami
          </span>
        </div>
      </div>
    </v-card-text>

    <SearchFriend
      v-show="canManageUsers"
      v-model="newFriend"
      class="friend-search"
      @change="sendFriendRequest"
    />

    <v-card-actions class="action-btns">
      <v-btn
        v-if="canManageUsers"
        text
        color="success"
        @click="savePersonalData"
      >
        changer les infos personnelles
      </v-btn>
      <v-btn
        v-if="canManageUsers && !isMe"
        text
        color="red"
        @click="deleteVolunteer"
      >
        supprimer
      </v-btn>
    </v-card-actions>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import SearchFriend from "~/components/atoms/field/search/SearchFriend.vue";
import {
  formatPhoneLink,
  formatUserNameWithNickname,
  formatUsername,
} from "~/utils/user/user.utils";
import { MANAGE_USERS, MANAGE_ADMINS } from "@overbookd/permission";
import { MyUserInformation, User, UserUpdateForm } from "@overbookd/user";
import { Team } from "@overbookd/http";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";
import {
  InputRulesData,
  isEmail,
  isInsaEmail,
  isMobilePhoneNumber,
  isNumber,
  required,
} from "~/utils/rules/input.rules";

type VolunteerPersonalDataFormData = InputRulesData & {
  nickname: string | null;
  phone: string;
  email: string;
  charisma: number;
  newTeam?: string;
  note?: string | null;
  newFriend: User | null;
};

export default defineComponent({
  name: "VolunteerPersonalDataForm",
  components: {
    ProfilePicture,
    TeamChip,
    SearchFriend,
  },
  emits: ["saved", "deleted"],
  data(): VolunteerPersonalDataFormData {
    return {
      nickname: null,
      phone: "",
      email: "",
      charisma: 0,
      newTeam: undefined,
      note: undefined,
      newFriend: null,
      rules: {
        required: required,
        email: isEmail,
        insaEmail: isInsaEmail,
        mobilePhone: isMobilePhoneNumber,
        number: isNumber,
      },
    };
  },

  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    selectedVolunteer(): UserPersonalDataWithProfilePicture {
      return this.$accessor.user.selectedUser;
    },
    selectedVolunteerFriends(): User[] {
      return this.$accessor.user.selectedUserFriends;
    },
    formatVolunteerName(): string {
      return formatUsername(this.selectedVolunteer);
    },
    formatVolunteerNameWithNickname(): string {
      return formatUserNameWithNickname(this.selectedVolunteer);
    },
    canManageUsers(): boolean {
      return this.$accessor.user.can(MANAGE_USERS);
    },
    isMe(): boolean {
      return this.me.id === this.selectedVolunteer.id;
    },
    assignableTeams(): Team[] {
      const teamsToAdd = this.$accessor.team.allTeams.filter(
        (team) => !this.selectedVolunteer.teams?.includes(team.code),
      );
      if (this.$accessor.user.can(MANAGE_ADMINS)) return teamsToAdd;
      return teamsToAdd.filter((team) => team.code !== "admin");
    },
    updatedVolunteer(): UserUpdateForm {
      const note =
        this.note !== undefined ? { note: this.note?.trim() || null } : null;
      return {
        nickname: this.nickname ? this.nickname : null,
        phone: this.phone,
        email: this.email,
        charisma: +this.charisma,
        ...note,
      };
    },
  },

  watch: {
    async selectedVolunteer() {
      await this.updateVolunteerInformations();
    },
  },

  async mounted() {
    await this.updateVolunteerInformations();
  },

  methods: {
    async updateVolunteerInformations() {
      this.nickname = this.selectedVolunteer.nickname ?? null;
      this.phone = this.selectedVolunteer.phone;
      this.email = this.selectedVolunteer.email;
      this.charisma = this.selectedVolunteer.charisma;
      this.note = this.selectedVolunteer.note;

      if (this.selectedVolunteer.profilePictureBlob) return;
      await this.$accessor.user.setSelectedUserProfilePicture();
    },

    async addTeam() {
      if (!this.newTeam) return;
      await this.$accessor.user.addTeamsToSelectedUser([this.newTeam]);

      this.$auth.refreshTokens();
      await this.updateVolunteerInformations();
      this.newTeam = undefined;
    },

    async removeTeam(team: string) {
      await this.$accessor.user.removeTeamFromSelectedUser(team);
      this.$auth.refreshTokens();
      await this.updateVolunteerInformations();
    },

    async sendFriendRequest() {
      if (
        this.newFriend === null ||
        this.selectedVolunteer.id === this.newFriend.id
      )
        return;
      this.$accessor.user.addFriendToSelectedUser(this.newFriend);
      this.newFriend = { id: 0, firstname: "", lastname: "" };
    },

    removeFriend(friend: User) {
      this.$accessor.user.removeFriendFromSelectedUser(friend);
    },

    async savePersonalData() {
      const id = this.selectedVolunteer.id;
      const user = this.updatedVolunteer;
      await this.$accessor.user.updateUser({ id, user });
      this.$emit("saved");
    },

    async deleteVolunteer() {
      await this.$accessor.user.deleteUser(this.selectedVolunteer.id);
      this.$emit("deleted");
    },

    formatUserName(user: User): string {
      return formatUsername(user);
    },

    sendEmail() {
      window.location.href = `mailto:${this.selectedVolunteer.email}`;
    },

    callPhoneNumber() {
      window.location.href = formatPhoneLink(this.selectedVolunteer.phone);
    },
  },
});
</script>

<style lang="scss" scoped>
.card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  @media only screen and(max-width: $mobile-max-width) {
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
