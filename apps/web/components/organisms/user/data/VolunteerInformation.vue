<template>
  <v-card>
    <div class="volunteer-info">
      <div class="volunteer-info__personnal-data">
        <v-card-title class="card-title">
          <ProfilePicture :user="selectedVolunteer" />
          {{ formatVolunteerNameWithNickname }}
        </v-card-title>
        <v-card-text>
          <TeamChip
            v-for="team of selectedVolunteer.teams"
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
                  <v-btn icon :href="'mailto:' + selectedVolunteer.email">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                  <h3>{{ selectedVolunteer.email }}</h3>
                </div>
                <div class="row">
                  <v-btn icon :href="selectedVolunteerPhoneLink">
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
                  <h3>{{ selectedVolunteerPhone }}</h3>
                </div>
              </div>

              <div class="row">
                <v-text-field
                  v-model="firstname"
                  label="Prénom"
                  :disabled="!canEditVolunteerData"
                ></v-text-field>
                <v-text-field
                  v-model="lastname"
                  label="Nom"
                  :disabled="!canEditVolunteerData"
                ></v-text-field>
              </div>

              <v-textarea
                v-model="comment"
                label="Commentaire"
                :rows="4"
                :disabled="!canEditVolunteerData"
              ></v-textarea>

              <div class="row">
                <v-text-field
                  v-model="nickname"
                  label="Surnom"
                  :disabled="!canEditVolunteerData"
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
                  :disabled="!canEditVolunteerData"
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
                <v-chip
                  v-for="friend in selectedVolunteerFriends"
                  :key="friend.id"
                >
                  {{ friend.firstname }} {{ friend.lastname }}
                </v-chip>
                <p v-show="selectedVolunteerFriends.length === 0" class="ml-3">
                  Aucun ami
                </p>
              </div>
            </div>
          </v-container>
        </v-card-text>
        <div class="action-btns">
          <v-btn
            v-if="canEditVolunteerData"
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
          <v-btn
            v-if="canManageUsers"
            text
            color="red"
            @click="deleteVolunteer"
          >
            supprimer
          </v-btn>
        </div>
      </div>
      <div class="volunteer-info__availabilities">
        <AvailabilitiesSumup :user-id="selectedVolunteer.id" />
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
import { MyUserInformation, User } from "@overbookd/user";
import { Team } from "~/utils/models/team.model";
import { UserPersonnalDataWithProfilePicture } from "~/utils/models/user.model";

interface VolunteerInformationData extends InputRulesData {
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
  name: "VolunteerInformation",
  components: {
    TeamChip,
    AvailabilitiesSumup,
    DateField,
    ProfilePicture,
  },

  data(): VolunteerInformationData {
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
    selectedVolunteer(): UserPersonnalDataWithProfilePicture {
      return this.$accessor.user.selectedUser;
    },
    selectedVolunteerFriends(): User[] {
      return this.$accessor.user.selectedUserFriends;
    },
    formatVolunteerNameWithNickname(): string {
      return formatUserNameWithNickname(this.selectedVolunteer);
    },
    canEditVolunteerData(): boolean {
      return this.canManageUsers || this.isMe;
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
    selectedVolunteerPhone(): string {
      return formatUserPhone(this.selectedVolunteer.phone);
    },
    selectedVolunteerPhoneLink(): string {
      return formatPhoneLink(this.selectedVolunteer.phone);
    },
    updatedVolunteer(): UserPersonnalDataWithProfilePicture {
      return {
        ...this.selectedVolunteer,
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
    async selectedVolunteer() {
      await this.updateVolunteerInformations();
    },
  },

  async mounted() {
    await this.updateVolunteerInformations();
  },

  methods: {
    async updateVolunteerInformations() {
      this.firstname = this.selectedVolunteer.firstname;
      this.lastname = this.selectedVolunteer.lastname;
      this.nickname = this.selectedVolunteer.nickname;
      this.comment = this.selectedVolunteer.comment;
      this.birthdate = this.selectedVolunteer.birthdate;
      this.phone = this.selectedVolunteer.phone;
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
    async savePersonnalData() {
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

.volunteer-info {
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
  .volunteer-info {
    flex-direction: column;

    &__personnal-data,
    &__availabilities {
      width: 100%;
    }
  }
}
</style>
