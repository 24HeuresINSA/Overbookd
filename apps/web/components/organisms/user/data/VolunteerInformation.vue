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
          <div v-if="canManageUsers" class="row">
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
                <v-icon class="charisma-icon">mdi-emoticon-cool-outline</v-icon>
                <span>
                  {{ selectedVolunteer.charisma || 0 }} points de charisme
                </span>
              </div>

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

              <DateField
                v-model="birthdate"
                label="Date de naissance"
                :boxed="false"
                :disabled="!canManageUsers"
              ></DateField>

              <v-text-field
                v-model="email"
                label="Email"
                :rules="[rules.required, rules.email, rules.insaEmail]"
                persistent-hint
              ></v-text-field>

              <v-text-field
                v-model="phone"
                label="Numéro de téléphone"
                :disabled="!canManageUsers"
                type="number"
              ></v-text-field>
            </div>

            <div v-if="selectedVolunteer.comment">
              <h3>Commentaire</h3>
              <p>{{ selectedVolunteer.comment }}</p>
            </div>

            <div class="friends">
              <h3>Amis :</h3>
              <div class="row">
                <v-chip
                  v-for="friend in selectedVolunteerFriends"
                  :key="friend.id"
                >
                  {{ formatUserName(friend) }}
                </v-chip>
                <span v-show="selectedVolunteerFriends.length === 0">
                  Aucun ami
                </span>
              </div>
            </div>
          </v-container>
        </v-card-text>

        <v-card-actions class="action-btns">
          <v-btn
            v-if="canManageUsers"
            text
            color="success"
            @click="savePersonnalData"
          >
            changer les infos personnelles
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
        </v-card-actions>
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
import {
  formatPhoneLink,
  formatUserNameWithNickname,
  formatUserPhone,
  formatUsername,
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
import {
  InputRulesData,
  isEmail,
  isInsaEmail,
  required,
} from "~/utils/rules/input.rules";

interface VolunteerInformationData extends InputRulesData {
  birthdate: Date;
  phone: string;
  email: string;

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
      birthdate: new Date(),
      phone: "",
      email: "",

      newTeam: undefined,
      rules: {
        required: required,
        email: isEmail,
        insaEmail: isInsaEmail,
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
        birthdate: this.birthdate,
        phone: this.phone,
        email: this.email,
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
      this.birthdate = this.selectedVolunteer.birthdate;
      this.phone = this.selectedVolunteer.phone;
      this.email = this.selectedVolunteer.email;

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
    formatUserName(user: User): string {
      return formatUsername(user);
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
  gap: 10px;
}

.row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.volunteer-info {
  display: flex;
  gap: 15px;
  &__personnal-data {
    width: 40%;
  }
  &__availabilities {
    width: 60%;
  }

  @media only screen and(max-width: $mobile-max-width) {
    flex-direction: column;
    &__personnal-data {
      width: 100%;
    }
    &__availabilities {
      display: none;
    }
  }
}

.charisma-icon {
  margin: 0 5px;
}

.friends {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.action-btns {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
