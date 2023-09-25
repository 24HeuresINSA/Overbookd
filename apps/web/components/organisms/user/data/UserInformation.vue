<template>
  <v-card>
    <div class="user-information">
      <div class="user-information__personnal-data">
        <v-card-title class="card-title">
          <ProfilePicture :user="selectedUser" />
          {{ formatUserNameWithNickname }}
        </v-card-title>
        <v-card-text>
          <TeamChip
            v-for="team of selectedUser.teams"
            :key="team"
            :team="team"
            with-name
            close
            @close="removeTeam"
          ></TeamChip>
          <div v-if="canManageUsers" class="d-flex align-center">
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

          <v-container>
            <div class="column">
              <div class="row">
                <div class="row">
                  <v-btn icon :href="'mailto:' + selectedUser.email">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                  <h3>{{ selectedUser.email }}</h3>
                </div>
                <div class="row">
                  <v-btn icon :href="selectedUserPhoneLink">
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
                  <h3>{{ selectedUserPhone }}</h3>
                </div>
              </div>

              <div class="row">
                <v-text-field
                  v-model="firstname"
                  label="Prénom"
                  :disabled="!canEditUserData"
                ></v-text-field>
                <v-text-field
                  v-model="lastname"
                  label="Nom"
                  :disabled="!canEditUserData"
                ></v-text-field>
              </div>

              <v-textarea
                v-model="comment"
                label="Commentaire"
                :rows="4"
                :disabled="!canEditUserData"
              ></v-textarea>

              <div class="row">
                <v-text-field
                  v-model="nickname"
                  label="Surnom"
                  :disabled="!canEditUserData"
                ></v-text-field>
                <DateField
                  v-model="birthdate"
                  label="Date de naissance"
                  :boxed="false"
                  :disabled="!canManageUsers"
                ></DateField>
              </div>

              <div class="row">
                <v-text-field
                  v-model="phone"
                  label="Numéro de téléphone "
                  :disabled="!canEditUserData"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model="charisma"
                  label="Charisme"
                  type="number"
                  :rules="[rules.number, rules.min]"
                  :disabled="!canManageUsers"
                ></v-text-field>
              </div>
            </div>
            <div class="column">
              <h4 class="mb-4">Amis :</h4>
              <div class="row">
                <v-chip v-for="friend in selectedUserFriends" :key="friend.id">
                  {{ friend.firstname }} {{ friend.lastname }}
                </v-chip>
                <p v-show="selectedUserFriends.length === 0" class="ml-3">
                  Aucun ami
                </p>
              </div>
            </div>
          </v-container>
        </v-card-text>
        <div class="action-btns">
          <v-btn
            v-if="canEditUserData"
            text
            color="success"
            @click="savePersonnalData"
          >
            changer les informations personnelles
          </v-btn>
          <v-btn
            v-if="canManageAvailability"
            text
            color="warning"
            @click="saveAvailabilities"
          >
            changer les disponibilites
          </v-btn>
          <v-btn v-if="canManageUsers" text color="red" @click="deleteUser">
            supprimer
          </v-btn>
        </div>
      </div>
      <div class="user-information__availabilities">
        <AvailabilitiesSumup :user-id="selectedUser.id" />
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";
import {
  formatPhoneLink,
  formatUserNameWithNickname,
  formatUserPhone,
} from "~/utils/user/user.utils";
import DateField from "../../../atoms/field/date/DateField.vue";
import AvailabilitiesSumup from "../../../molecules/availabilities/AvailabilitiesSumup.vue";
import {
  MANAGE_USERS,
  MANAGE_ADMINS,
  AFFECT_VOLUNTEER,
} from "@overbookd/permission";
import { MyUserInformation, User, UserPersonnalData } from "@overbookd/user";
import { Team } from "~/utils/models/team.model";

interface UserInformationData extends InputRulesData {
  firstname: string;
  lastname: string;
  nickname?: string;
  comment?: string;
  birthdate: Date;
  phone: string;
  charisma: number;

  newTeam?: string;
}

export default Vue.extend({
  name: "UserInformation",
  components: {
    TeamChip,
    AvailabilitiesSumup,
    DateField,
    ProfilePicture,
  },

  data(): UserInformationData {
    return {
      firstname: "",
      lastname: "",
      nickname: "",
      comment: "",
      birthdate: new Date(),
      phone: "",
      charisma: 0,

      newTeam: undefined,
      rules: {
        number: isNumber,
        min: min(0),
      },
    };
  },

  computed: {
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
    selectedUser(): UserPersonnalData {
      return this.$accessor.user.selectedUser;
    },
    selectedUserFriends(): User[] {
      return this.$accessor.user.selectedUserFriends;
    },
    formatUserNameWithNickname(): string {
      return formatUserNameWithNickname(this.selectedUser);
    },
    canEditUserData(): boolean {
      return this.canManageUsers || this.isMe;
    },
    canManageUsers(): boolean {
      return this.$accessor.user.can(MANAGE_USERS);
    },
    canManageAvailability(): boolean {
      return this.$accessor.user.can(AFFECT_VOLUNTEER);
    },
    isMe(): boolean {
      return this.me.id === this.selectedUser.id;
    },
    assignableTeams(): Team[] {
      const teamsToAdd = this.$accessor.team.allTeams.filter(
        (team) => !this.selectedUser.teams?.includes(team.code),
      );
      if (this.$accessor.user.can(MANAGE_ADMINS)) return teamsToAdd;
      return teamsToAdd.filter((team) => team.code !== "admin");
    },
    selectedUserPhone(): string {
      return formatUserPhone(this.selectedUser.phone);
    },
    selectedUserPhoneLink(): string {
      return formatPhoneLink(this.selectedUser.phone);
    },
    updatedUser(): UserPersonnalData {
      return {
        ...this.selectedUser,
        firstname: this.firstname,
        lastname: this.lastname,
        nickname: this.nickname,
        comment: this.comment,
        birthdate: this.birthdate,
        phone: this.phone,
        charisma: this.charisma,
      };
    },
  },

  watch: {
    async selectedUser() {
      await this.updateUserInformations();
      await this.$accessor.user.setSelectedUserProfilePicture();
    },
  },

  async mounted() {
    await this.updateUserInformations();
    await this.$accessor.user.setSelectedUserProfilePicture();
  },

  methods: {
    async updateUserInformations() {
      this.firstname = this.selectedUser.firstname;
      this.lastname = this.selectedUser.lastname;
      this.nickname = this.selectedUser.nickname;
      this.comment = this.selectedUser.comment;
      this.birthdate = this.selectedUser.birthdate;
      this.phone = this.selectedUser.phone;
      this.charisma = this.selectedUser.charisma;
    },
    async addTeam() {
      if (!this.newTeam) return;
      await this.$accessor.user.addTeamsToSelectedUser([this.newTeam]);

      this.$auth.refreshTokens();
      await this.updateUserInformations();
      this.newTeam = undefined;
    },
    async removeTeam(team: string) {
      await this.$accessor.user.removeTeamFromSelectedUser(team);

      this.$auth.refreshTokens();
      await this.updateUserInformations();
    },
    async savePersonnalData() {
      await this.$accessor.user.updateUser(this.updatedUser);
    },
    async saveAvailabilities() {
      await this.$accessor.volunteerAvailability.overrideVolunteerAvailabilities(
        this.selectedUser.id,
      );
      this.$emit("close-dialog");
    },
    async deleteUser() {
      await this.$accessor.user.deleteUser(this.selectedUser.id);

      if (this.isMe) return this.$auth.logout();
      this.$emit("close-dialog");
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

.column {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 0;
}

.user-information {
  display: flex;
  gap: 10px;

  &__personnal-data {
    width: 40%;
  }
  &__availabilities {
    width: 60%;
  }
}

.action-btns {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

@media only screen and(max-width: $mobile-max-width) {
  .user-information {
    flex-direction: column;

    &__personnal-data,
    &__availabilities {
      width: 100%;
    }
  }
}
</style>
