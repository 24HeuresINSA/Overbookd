<template>
  <v-dialog v-model="mToggle" max-width="600">
    <v-card>
      <v-img
        v-if="mUser.pp"
        :src="getPPUrl() + 'api/user/pp/' + mUser.pp"
        max-height="300px"
      ></v-img>
      <v-card-title
        >{{ mUser.nickname ? mUser.nickname : mUser.lastname }}
      </v-card-title>
      <v-card-text>
        <OverChips :roles="mUser.team"></OverChips>
        <div v-if="hasEditingRole">
          <v-select v-model="newRole" label="ajouter un role" :items="teams">
          </v-select>
          <v-btn text @click="addRole()">ajouter</v-btn>
          <v-btn text @click="deleteAllTeams()">révoquer tous les rôles</v-btn>
          <v-btn text @click="saveUser()">sauvgarder</v-btn>
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
                :disabled="!(hasEditingRole || isMe())"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="mUser.firstname"
                label="Prénom"
                :disabled="!(hasEditingRole || isMe())"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="mUser.nickname"
                label="Surnom"
                :disabled="!(hasEditingRole || isMe())"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="mUser.birthdate"
                label="Date de naissance"
                placeholder="AAAA-MM-JJ"
                :disabled="true"
              ></v-text-field>
            </v-col>
            <v-col md="6" style="display: flex; align-items: baseline">
              <p>+33&nbsp;</p>
              <v-text-field
                v-model="mUser.phone"
                label="Numéro de téléphone "
                :disabled="!(hasEditingRole || isMe())"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-switch
                v-model="mUser.hasDriverLicense"
                label="Permis"
                :disabled="!(hasEditingRole || isMe())"
              ></v-switch>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="mUser.driverLicenseDate"
                label="date d'obtention du permis"
                placeholder="AAAA-MM-JJ"
                :disabled="!hasEditingRole"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="mUser.charisma"
                label="Charisme"
                :disabled="true"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="mUser.year"
                label="Année"
                :disabled="!hasEditingRole"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="mUser.departement"
                label="Département"
                :disabled="!hasEditingRole"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-text-field
                v-model="mUser.balance"
                label="Solde compte perso"
                :disabled="true"
              ></v-text-field>
            </v-col>
            <v-col md="6">
              <v-switch
                v-model="mUser.hasPayedContribution"
                label="Cotisation"
                :disabled="!hasEditingRole"
              ></v-switch>
            </v-col>
            <v-col md="12">
              <v-text-field
                v-model="mUser.comment"
                label="Commentaire"
                :disabled="!(hasEditingRole || isMe())"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="hasEditingRole" text color="red" @click="deleteUser()"
          >supprimer</v-btn
        >
        <v-spacer />
        <v-btn text @click="saveUser()">sauvegarder</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import OverChips from "~/components/atoms/overChips";
import { safeCall } from "../../utils/api/calls";
import userRepo from "~/repositories/userRepo";

export default {
  name: "UserInformation",
  components: { OverChips },
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
      teams: [],
      hasEditingRole: false,
    };
  },

  computed: {
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
  },

  async mounted() {
    this.teams = this.$accessor.config.data.data
      .find((e) => e.key === "teams")
      .value.map((e) => e.name);
    this.hasEditingRole = await this.hasRole(["admin", "humain"]);
  },

  methods: {
    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },
    async hasRole(roles) {
      return this.$accessor.user.hasRole(roles);
    },
    async addRole() {
      let user = this.mUser;
      if (user.team === undefined) {
        user.team = [];
      }
      if (user.team.find((role) => role === this.newRole)) {
        // already has role
      } else {
        user.team.push(this.newRole);
        this.$set(user, "team", user.team); // update rendering
        await this.$axios.put(`/user/${user._id}`, { team: user.team });
      }
    },
    async saveUser() {
      await safeCall(
        this,
        userRepo.updateUser(this, this.mUser._id, this.mUser)
      );
      // await this.$axios.put(`/user/${this.mUser._id}`, this.mUser);
      this.mToggle = false;
    },
    async deleteUser() {
      this.mUser.isValid = false;
      await this.saveUser();
    },
    async deleteAllTeams() {
      this.mUser.team = [];
      await this.$axios.put(`/user/${this.mUser._id}`, this.mUser);
    },
    isMe() {
      return this.$accessor.user.me._id === this.mUser._id;
    },
  },
};
</script>

<style scoped></style>
