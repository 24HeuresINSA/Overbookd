<template>
  <div>
    <v-form>
      <v-container class="form-container">
        <v-row><p>Entre l'email de ton compte.</p></v-row>
        <v-row>
          <v-text-field
            v-model="email"
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
    email: "",
    snack: new Snack(3000),
  }),

  methods: {
    sendResetRequest: async function () {
      const res = await safeCall(
        this.$store,
        RepoFactory.authRepo.requestResetPassword(this, {
          email: this.email,
        })
      );

      if (!res) {
        return this.snack.display(
          "Il y a eu une erreur, recommence plus tard."
        );
      }

      this.snack.display(
        "OK ! Regarde ta boite mail ! Redirection au login..."
      );

      setTimeout(async () => {
        await this.$router.push({
          path: "/",
        });
      }, 3000);
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
