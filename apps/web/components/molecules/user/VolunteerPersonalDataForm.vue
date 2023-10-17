<template>
  <div>
    <v-card-title class="card-title">
      <ProfilePicture :user="selectedVolunteer" />
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
            close
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

      <div class="friends">
        <h3>Amis</h3>
        <div class="friends__list">
          <v-chip v-for="friend in selectedVolunteerFriends" :key="friend.id">
            {{ formatUserName(friend) }}
          </v-chip>
          <span v-show="selectedVolunteerFriends.length === 0">
            Aucun ami
          </span>
        </div>
      </div>
    </v-card-text>

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
        v-if="canManageAvailability"
        text
        color="warning"
        class="availability-btn"
        @click="saveAvailabilities"
      >
        changer les disponibilites
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
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import {
  formatPhoneLink,
  formatUserNameWithNickname,
  formatUsername,
} from "~/utils/user/user.utils";
import {
  MANAGE_USERS,
  MANAGE_ADMINS,
  AFFECT_VOLUNTEER,
} from "@overbookd/permission";
import { MyUserInformation, User } from "@overbookd/user";
import { Team } from "~/utils/models/team.model";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";
import {
  InputRulesData,
  isEmail,
  isInsaEmail,
  isMobilePhoneNumber,
  isNumber,
  required,
} from "~/utils/rules/input.rules";

interface VolunteerPersonalDataFormData extends InputRulesData {
  nickname: string | null;
  phone: string;
  email: string;
  charisma: number;
  newTeam?: string;
}

export default Vue.extend({
  name: "VolunteerPersonalDataForm",
  components: {
    ProfilePicture,
    TeamChip,
  },
  data(): VolunteerPersonalDataFormData {
    return {
      nickname: null,
      phone: "",
      email: "",
      charisma: 0,
      newTeam: undefined,
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
    canManageAvailability(): boolean {
      return this.$accessor.user.can(AFFECT_VOLUNTEER);
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
    updatedVolunteer(): UserPersonalDataWithProfilePicture {
      return {
        ...this.selectedVolunteer,
        nickname: this.nickname ? this.nickname : null,
        phone: this.phone,
        email: this.email,
        charisma: this.charisma,
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

    async savePersonalData() {
      await this.$accessor.user.updateUser(this.updatedVolunteer);
    },

    async saveAvailabilities() {
      await this.$accessor.volunteerAvailability.overrideVolunteerAvailabilities(
        this.selectedVolunteer.id,
      );
      this.$emit("close-dialog");
    },

    async deleteVolunteer() {
      await this.$accessor.user.deleteUser(this.selectedVolunteer.id);
      this.$emit("close-dialog");
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

.availability-btn {
  @media only screen and(max-width: $mobile-max-width) {
    display: none;
  }
}

.friends {
  display: flex;
  flex-direction: column;
  gap: 5px;
  &__list {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0;
  }
}

.action-btns {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
