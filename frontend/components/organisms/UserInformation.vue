<template>
  <v-dialog v-model="mToggle">
    <v-card>
      <div class="user-information">
        <div class="user-information__personnal-data">
          <v-img
            v-if="mUser.pp"
            :src="getPPUrl() + 'api/user/pp/' + mUser.pp"
            max-height="200px"
          ></v-img>
          <v-card-title>
            {{ formatUserNameWithNickname }}
          </v-card-title>
          <v-card-text>
            <OverChips :roles="mUser.team" />
            <div v-if="hasEditingRole" class="d-flex align-center">
              <v-select
                v-model="newRole"
                label="Ajouter un role"
                :items="teamNames"
              >
              </v-select>
              <v-btn text @click="addRemoveRole()">Ajouter/Retier</v-btn>
              <v-btn text @click="saveUserRoles()">Sauvegarder les roles</v-btn>
            </div>

            <v-container>
              <v-row>
                <v-col
                  md="6"
                  style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  "
                >
                  <v-btn icon :href="'mailto:' + mUser.email">
                    <v-icon>mdi-send</v-icon>
                  </v-btn>
                  <h3>{{ mUser.email }}</h3>
                </v-col>
                <v-col md="6" style="display: flex; align-items: baseline">
                  <v-btn icon :href="'tel:+33:' + mUser.phone">
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
                  <h3>+33{{ mUser.phone }}</h3>
                </v-col>
                <v-col md="6">
                  <v-text-field
                    v-model="mUser.lastname"
                    label="Nom"
                    :disabled="!canEditUserData"
                  ></v-text-field>
                </v-col>
                <v-col md="6">
                  <v-text-field
                    v-model="mUser.firstname"
                    label="Prénom"
                    :disabled="!canEditUserData"
                  ></v-text-field>
                </v-col>
                <v-col md="12">
                  <v-textarea
                    v-model="mUser.comment"
                    label="Commentaire"
                    :disabled="!canEditUserData"
                  ></v-textarea>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    v-model="mUser.nickname"
                    label="Surnom"
                    :disabled="!canEditUserData"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <DateField
                    v-model="mUser.birthdate"
                    label="Date de naissance"
                    :boxed="false"
                    :disabled="!hasEditingRole"
                  ></DateField>
                </v-col>
                <v-col md="4" style="display: flex; align-items: baseline">
                  <p>+33&nbsp;</p>
                  <v-text-field
                    v-model="mUser.phone"
                    label="Numéro de téléphone "
                    :disabled="!canEditUserData"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    v-model="mUser.year"
                    label="Année"
                    :disabled="!hasEditingRole"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    v-model="mUser.department"
                    label="Département"
                    :disabled="!hasEditingRole"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-text-field
                    v-model="mUser.charisma"
                    label="Charisme"
                    type="number"
                    :rules="[rules.number, rules.min]"
                    :disabled="!hasEditingRole"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row v-if="hasUserRole('hard')">
                <v-col md="4">
                  <v-text-field
                    v-model="mUser.balance"
                    label="Solde compte perso"
                    :disabled="true"
                  ></v-text-field>
                </v-col>
                <v-col md="4">
                  <v-switch
                    v-model="mUser.has_payed_contributions"
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
            :user-id="mUser.id"
            @close-dialog="closeDialog"
          ></AvailabilitiesSumup>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import OverChips from "~/components/atoms/OverChips";
import { RepoFactory } from "~/repositories/repoFactory";
import { isNumber, min } from "~/utils/rules/inputRules";
import { formatUserNameWithNickname } from "~/utils/user/userUtils";
import { safeCall } from "../../utils/api/calls";
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
    user: {
      type: Object,
      default: () => undefined,
    },
    toggle: {
      type: Boolean,
      default: () => false,
    },
  },

  data: () => {
    return {
      newRole: undefined,
      teamNames: [],
      isEditingAvailability: false,
      usernames: undefined,
      newFriend: undefined,
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
    mUser: {
      get: function () {
        return this.user;
      },
      set: function (newUser) {
        this.$emit("update-user", newUser);
      },
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
      return formatUserNameWithNickname(this.mUser);
    },
    canEditUserData() {
      return this.hasEditingRole || this.isMe;
    },
    hasEditingRole() {
      return this.hasPermission("manage-users");
    },
    isMe() {
      return this.$accessor.user.me.id === this.mUser.id;
    },
  },

  async mounted() {
    this.teamNames = this.$accessor.team.teamNames;
    const res = await safeCall(
      this.$store,
      RepoFactory.userRepo.getAllUsers(this)
    );
    if (res) {
      this.usernames = res.data
        .map((user) => {
          if (!user.team.includes("hard")) {
            const username = user.firstname + " " + user.lastname;
            return { text: username, value: user };
          }
        })
        .filter((item) => item);
    }
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
      if (!this.teamNames.includes(this.newRole)) {
        this.$accessor.notif.pushNotification({
          type: "error",
          message: "Veuillez choisir une option valide !",
        });
        return;
      }
      // verify the user is not already in the team
      if (this.mUser.team.includes(this.newRole)) {
        // Remove it
        this.mUser.team = this.mUser.team.filter(
          (role) => role !== this.newRole
        );
      } else {
        this.mUser.team.push(this.newRole);
      }
    },
    async saveUserRoles() {
      const res = await this.$accessor.team.linkUserToTeams({
        userId: this.mUser.id,
        teams: this.mUser.team,
      });
      if (res.status === 201) {
        this.mUser.team = res.data.teams;
        this.$accessor.notif.pushNotification({
          type: "success",
          message: "Roles mis à jour",
        });
      } else {
        this.$accessor.notif.pushNotification({
          type: "error",
          message: "Une erreur est survenue !",
        });
      }
    },
    saveUser() {
      this.$accessor.user.updateUser(this.mUser);
      this.closeDialog();
    },
    deleteUser() {
      this.mUser.isValid = false;
      this.saveUser();
    },
    closeDialog() {
      this.mToggle = false;
    },
    hasUserRole(roles) {
      if (this.mUser.team === undefined) {
        return false;
      } else {
        return this.mUser.team.includes(roles);
      }
    },
    async validateUser() {
      if (this.mUser.team.includes("toValidate")) {
        for (var i = 0; i < this.mUser.team.length; i++) {
          if (this.mUser.team[i] === "toValidate") {
            this.mUser.team.splice(i, 1);
          }
        }
        this.mUser.team.push("soft");
        await this.$axios.put(`/user/${this.mUser._id}`, {
          team: this.mUser.team,
        });
        this.saveUser();
      }
    },
    async unvalidateUser() {
      if (this.mUser.team.includes("soft")) {
        this.mUser.team = ["toValidate"];
        this.mUser.availabilities = [];
        await this.$axios.get("/timespan/user/unassignall/" + this.mUser._id);
      }
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
