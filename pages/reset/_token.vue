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
            @keydown.enter="sendResetRequest()"
          ></v-text-field>
        </v-row>
        <v-btn @click="sendResetRequest()">Valider</v-btn>
      </v-container>
    </v-form>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";
export default Vue.extend({
  name: "ForgotPassword",
  //@ts-ignore
  auth: false,
  layout: "none",
  data: () => ({
    password: "",
    password2: "",
    snackbar: false,
    feedbackMessage: "",
    timeout: 5000,
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
      if (res) {
        this.feedbackMessage = "Password changé, redirection au login...";
        this.snackbar = true;
        setTimeout(async () => {
          await this.$router.push({
            path: "/",
          });
        }, 2000);
      } else {
        this.feedbackMessage =
          "Ca n'a pas marché, peut-etre que le lien est expiré...";
        this.snackbar = true;
      }
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
