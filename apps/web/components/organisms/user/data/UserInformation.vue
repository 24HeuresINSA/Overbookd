<template>
  <v-card>
    <div class="user-information">
      <div class="user-information__personnal-data">
        <ProfilePicture :user="selectedUser" />
        <v-card-title>
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
            <v-row>
              <v-col md="6" class="d-flex align-center justify-center">
                <v-btn icon :href="'mailto:' + selectedUser.email">
                  <v-icon>mdi-send</v-icon>
                </v-btn>
                <h3>{{ selectedUser.email }}</h3>
              </v-col>
              <v-col md="6" style="display: flex; align-items: baseline">
                <v-btn icon :href="selectedUserPhoneLink">
                  <v-icon>mdi-phone</v-icon>
                </v-btn>
                <h3>{{ selectedUserPhone }}</h3>
              </v-col>
              <v-col md="6">
                <v-text-field
                  v-model="user.lastname"
                  label="Nom"
                  :disabled="!canEditUserData"
                ></v-text-field>
              </v-col>
              <v-col md="6">
                <v-text-field
                  v-model="user.firstname"
                  label="Prénom"
                  :disabled="!canEditUserData"
                ></v-text-field>
              </v-col>
              <v-col md="12">
                <v-textarea
                  v-model="user.comment"
                  label="Commentaire"
                  :disabled="!canEditUserData"
                ></v-textarea>
              </v-col>
              <v-col md="4">
                <v-text-field
                  v-model="user.nickname"
                  label="Surnom"
                  :disabled="!canEditUserData"
                ></v-text-field>
              </v-col>
              <v-col md="4">
                <DateField
                  v-model="user.birthdate"
                  label="Date de naissance"
                  :boxed="false"
                  :disabled="!canManageUsers"
                ></DateField>
              </v-col>
              <v-col md="4" style="display: flex; align-items: baseline">
                <p>+33&nbsp;</p>
                <v-text-field
                  v-model="user.phone"
                  label="Numéro de téléphone "
                  :disabled="!canEditUserData"
                  type="number"
                ></v-text-field>
              </v-col>
              <v-col md="4">
                <v-text-field
                  v-model="user.charisma"
                  label="Charisme"
                  type="number"
                  :rules="[rules.number, rules.min]"
                  :disabled="!canManageUsers"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-col class="pl-0">
              <h4 class="mb-4">Amis :</h4>
              <v-row>
                <v-chip
                  v-for="friend in selectedUserFriends"
                  :key="friend.id"
                  class="mr-2 mb-2"
                >
                  {{ friend.firstname }} {{ friend.lastname }}
                </v-chip>
                <p v-show="selectedUserFriends.length === 0" class="ml-3">
                  Aucun ami
                </p>
              </v-row>
            </v-col>
          </v-container>
        </v-card-text>
        <div class="ctas">
          <v-btn v-if="canManageUsers" text color="red" @click="deleteUser">
            supprimer
          </v-btn>
          <v-btn text color="success" @click="savePersonnalData()">
            changer les informations personnelles
          </v-btn>
          <v-btn text color="warning" @click="saveAvailabilities()">
            changer les disponibilites
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
import { MANAGE_USERS, MANAGE_ADMINS } from "@overbookd/permission";
import { MyUserInformation, User, UserPersonnalData } from "@overbookd/user";
import { Team } from "~/utils/models/team.model";

interface UserInformationData extends InputRulesData {
  user: {
    lastname?: string;
    firstname?: string;
    comment?: string;
    nickname?: string;
    birthdate?: Date;
    phone?: string;
    charisma?: number;
  };
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

  data: (): UserInformationData => ({
    user: {},
    newTeam: undefined,
    rules: {
      number: isNumber,
      min: min(0),
    },
  }),

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
    isMe(): boolean {
      return this.me.id === this.selectedUser.id;
    },
    isHard(): boolean {
      return this.selectedUser.teams?.includes("hard") ?? false;
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
  },

  watch: {
    async selectedUser(newUser, oldUser) {
      this.user = { ...this.selectedUser };
      if (oldUser.id === newUser.id) return;
      await this.$accessor.user.setSelectedUserProfilePicture();
    },
  },

  async mounted() {
    this.user = { ...this.selectedUser };
    await this.$accessor.user.setSelectedUserProfilePicture();
  },

  methods: {
    async addTeam() {
      if (!this.newTeam) return;
      await this.$accessor.user.addTeamsToSelectedUser([this.newTeam]);
      this.$auth.refreshTokens();
      this.user = { ...this.selectedUser };
      this.newTeam = undefined;
    },
    async removeTeam(team: string) {
      await this.$accessor.user.removeTeamFromSelectedUser(team);
      this.$auth.refreshTokens();
      this.user = { ...this.selectedUser };
    },
    async savePersonnalData() {
      const userToUpdate = {
        ...this.selectedUser,
        ...this.user,
      };
      await this.$accessor.user.updateUser(userToUpdate);
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

.ctas {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}

@media only screen and(max-width: 2055px) {
  .ctas {
    flex-direction: column;
  }
}

@media only screen and(max-width: 965px) {
  .user-information {
    flex-direction: column;

    &__personnal-data,
    &__availabilities {
      width: 100%;
    }
  }
}
</style>
