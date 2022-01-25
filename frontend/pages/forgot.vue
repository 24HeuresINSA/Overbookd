<template>
  <div>
    <v-form>
      <v-container class="form-container">
        <v-row><p>Entre l'email de ton compte.</p></v-row>
        <v-row>
          <v-text-field
            v-model="userEmail"
            label="email"
            type="text"
            required
            autofocus
            outlined
            clearable
            solo
            filled
            @keydown.enter="sendResetRequest()"
          ></v-text-field>
        </v-row>
        <v-btn @click="sendResetRequest()">Envoyer</v-btn>
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
    userEmail: "",
    snackbar: false,
    feedbackMessage: "",
    timeout: 5000,
  }),
  methods: {
    sendResetRequest: async function () {
      const res = await safeCall(
        this.$store,
        RepoFactory.authRepo.requestResetPassword(this, {
          userEmail: this.userEmail,
        })
      );
      if (res) {
        this.feedbackMessage =
          "OK ! Regarde ta boite mail ! Redirection au login...";
        this.snackbar = true;
        setTimeout(async () => {
          await this.$router.push({
            path: "/",
          }); // redirect to login page
        }, 2000);
      } else {
        this.feedbackMessage = "Il y a eu une erreur, recommence plus tard.";
        this.snackbar = true;
      }
      return;
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
