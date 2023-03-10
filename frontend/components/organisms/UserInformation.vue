<template>
  <v-dialog v-model="mToggle">
    <v-card>
      <div class="user-information">
        <div class="user-information__personnal-data">
          <v-img
            v-if="selectedUser.pp"
            :src="getPPUrl() + 'api/user/pp/' + selectedUser.pp"
            max-height="200px"
          ></v-img>
          <v-card-title>
            {{ formatUserNameWithNickname }}
          </v-card-title>
          <v-card-text>
            <OverChips :roles="selectedUser.team" />
            <div v-if="hasEditingRole" class="d-flex align-center">
              <v-select
                v-model="newRole"
                label="Ajouter un role"
                :items="teamNames"
              >
              </v-select>
              <v-btn text @click="addRemoveRole()">Ajouter/Retier</v-btn>
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
                  <v-btn icon :href="'tel:+33:' + selectedUser.phone">
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
                  <h3>+33{{ selectedUser.phone }}</h3>
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
                    v-model="user.year"
                    label="Année"
                    :disabled="!hasEditingRole"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    v-model="user.department"
                    label="Département"
                    :disabled="!hasEditingRole"
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
                  <v-text-field
                    v-model="user.balance"
                    label="Solde compte perso"
                    :disabled="true"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-switch
                    v-model="user.has_payed_contributions"
                    label="Cotisation"
                    :disabled="!hasEditingRole"
                  ></v-switch> </v-col
              ></v-row>
            </v-container>
          </v-card-text>
          <v-row
            style="display: flex; justify-content: center; align-items: center"
          >
            <v-col md="3">
              <v-btn
                v-if="hasEditingRole"
                text
                color="red"
                @click="deleteUser()"
              >
                supprimer
              </v-btn>
            </v-col>
            <v-col md="3">
              <v-btn text color="success" @click="saveUser()">
                sauvegarder
              </v-btn>
            </v-col>
          </v-row>
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
import OverChips from "~/components/atoms/OverChips";
import { removeItemAtIndex } from "~/utils/functions/list";
import { isNumber, min } from "~/utils/rules/inputRules";
import { formatUserNameWithNickname } from "~/utils/user/userUtils";
import DateField from "../atoms/DateField.vue";
import AvailabilitiesSumup from "../molecules/availabilities/AvailabilitiesSumup.vue";

export default {
  name: "UserInformation",
  components: {
    OverChips,
    AvailabilitiesSumup,
    DateField,
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
      newRole: undefined,
      teamNames: [],
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
      return this.hasPermission("manage-users");
    },
    isMe() {
      return this.$accessor.user.me.id === this.selectedUser.id;
    },
    isHard() {
      return (this.selectedUser.team ?? []).includes("hard");
    },
  },

  watch: {
    selectedUser() {
      this.user = { ...this.selectedUser };
    },
  },

  async mounted() {
    this.teamNames = this.$accessor.team.teamNames;
    this.user = { ...this.selectedUser };
  },

  methods: {
    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },
    hasPermission(permission) {
      return this.$accessor.user.hasPermission(permission);
    },
    addRemoveRole() {
      if (!this.newRole) return;
      const teams = this.computeTeams();
      this.$accessor.user.updateSelectedUserTeams(teams);
    },
    computeTeams() {
      const teamIndex = this.selectedUser.team.indexOf(this.newRole);
      if (teamIndex !== -1) {
        return removeItemAtIndex(this.selectedUser.team, teamIndex);
      }
      return [...this.selectedUser.team, this.newRole];
    },
    saveUser() {
      this.$accessor.user.updateUser(this.user);
      this.mToggle = false;
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
