<template>
  <div>
    <v-form>
      <v-container class="form-container">
        <v-row><p>Rentre ton nouveau mot de passe.</p></v-row>
        <v-row>
          <v-text-field
            v-model="password"
            label="password"
            type="password"
            required
            autofocus
            outlined
            clearable
            solo
            filled
            :rules="passwordVerif"
          ></v-text-field>
        </v-row>
        <v-row>
          <v-text-field
            v-model="password2"
            label="re-enter password"
            type="password"
            required
            outlined
            clearable
            solo
            filled
            :rules="passwordVerif"
            @keydown.enter="sendResetRequest()"
          ></v-text-field>
        </v-row>
        <v-btn @click="sendResetRequest()">Valider</v-btn>
      </v-container>
    </v-form>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      {{ snack.feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";
import { Snack } from "~/utils/models/snack";

export default Vue.extend({
  name: "ForgotPassword",
  auth: false,
  layout: "none",
  data: () => ({
    password: "",
    password2: "",
    snack: new Snack(3000),
    passwordVerif: [
      (v: string) =>
        new RegExp(`^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$`).test(v) ||
        `au moins une MAJUSCULE, minuscule et un chiffre et au moins 8 caractères`,
    ],
  }),
  methods: {
    sendResetRequest: async function () {
      const res = await safeCall(
        this.$store,
        RepoFactory.authRepo.resetPassword(this, {
          token: this.$route.params.token,
          password: this.password,
          password2: this.password2,
        })
      );
      if (!res) {
        return this.snack.display(
          "Ca n'a pas marché, peut-etre que le lien est expiré..."
        );
      }

      this.snack.display("Password changé, redirection au login...");
      setTimeout(async () => {
        await this.$router.push({
          path: "/",
        });
      }, 2000);
    },
  },
});
</script>

<style>
.form-container {
  align-self: center;
  justify-self: center;
  margin-top: 10%;
  width: 75%;
  max-width: 600px;
}
</style>
