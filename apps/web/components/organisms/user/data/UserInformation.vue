<template>
  <v-dialog v-model="mToggle">
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
            <div v-if="hasEditingRole" class="d-flex align-center">
              <v-select
                v-model="newTeam"
                label="Choix de l'équipe"
                :items="manageableTeams"
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
                    :disabled="!hasEditingRole"
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
                    :disabled="!hasEditingRole"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="isHard">
                <v-col md="4">
                  <v-switch
                    v-model="user.hasPayedContributions"
                    label="Cotisation"
                    :disabled="!hasEditingRole"
                  ></v-switch>
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
            <v-btn v-if="hasEditingRole" text color="red" @click="deleteUser()">
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
          <AvailabilitiesSumup
            :user-id="selectedUser.id"
            @availabilities-updated="fetchUser"
          ></AvailabilitiesSumup>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import { isNumber, min } from "~/utils/rules/input.rules";
import {
  formatPhoneLink,
  formatUserNameWithNickname,
  formatUserPhone,
} from "~/utils/user/user.utils";
import DateField from "../../../atoms/field/date/DateField.vue";
import AvailabilitiesSumup from "../../../molecules/availabilities/AvailabilitiesSumup.vue";
import { MANAGE_USERS, MANAGE_ADMINS } from "@overbookd/permission";

export default {
  name: "UserInformation",
  components: {
    TeamChip,
    AvailabilitiesSumup,
    DateField,
    ProfilePicture,
  },
  props: {
    toggle: {
      type: Boolean,
      default: () => false,
    },
  },

  data: () => {
    return {
      user: {},
      newTeam: undefined,
      isEditingAvailability: false,
      rules: {
        number: isNumber,
        min: min(0),
      },
    };
  },

  computed: {
    me() {
      return this.$accessor.user.me;
    },
    selectedUser() {
      return this.$accessor.user.selectedUser;
    },
    selectedUserFriends() {
      return this.$accessor.user.selectedUserFriends;
    },
    mToggle: {
      get: function () {
        return this.toggle;
      },
      set: function (t) {
        this.$emit("update-toggle", t);
      },
    },
    formatUserNameWithNickname() {
      return formatUserNameWithNickname(this.selectedUser);
    },
    canEditUserData() {
      return this.hasEditingRole || this.isMe;
    },
    hasEditingRole() {
      return this.$accessor.user.can(MANAGE_USERS);
    },
    isMe() {
      return this.me.id === this.selectedUser.id;
    },
    isHard() {
      return this.selectedUser?.teams?.includes("hard") ?? false;
    },
    manageableTeams() {
      const teams = this.$accessor.team.allTeams;
      if (this.$accessor.user.can(MANAGE_ADMINS)) return teams;
      return teams.filter((team) => team.code !== "admin");
    },
    selectedUserPhone() {
      return formatUserPhone(this.selectedUser.phone);
    },
    selectedUserPhoneLink() {
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
  },

  methods: {
    async addTeam() {
      if (!this.newTeam) return;
      await this.$accessor.user.addTeamsToSelectedUser([this.newTeam]);
      this.$auth.refreshTokens();
      this.user = { ...this.selectedUser };
    },
    async removeTeam(team) {
      await this.$accessor.user.removeTeamFromSelectedUser(team);
      this.$auth.refreshTokens();
      this.user = { ...this.selectedUser };
    },
    async savePersonnalData() {
      await this.$accessor.user.updateUser(this.user);
      this.fetchUser(this.user.id);
    },
    async saveAvailabilities() {
      await this.$accessor.volunteerAvailability.overrideVolunteerAvailabilities(
        this.user.id,
      );
      this.fetchUser(this.user.id);
    },
    deleteUser() {
      this.$accessor.user.deleteUser(this.user.id);
      this.mToggle = false;
    },
    fetchUser(userId) {
      this.$accessor.user.fetchAndUpdateLocalUser(userId);
      this.mToggle = false;
    },
  },
};
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
