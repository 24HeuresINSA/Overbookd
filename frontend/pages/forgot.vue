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
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default Vue.extend({
  name: "ForgotPassword",
  components: { SnackNotificationContainer },
  auth: false,
  layout: "none",

  data: () => ({
    email: "",
  }),

  methods: {
    sendResetRequest: async function () {
      const res = await safeCall(
        this.$store,
        RepoFactory.authRepo.requestResetPassword(this, {
          email: this.email,
        }),
        {
          successMessage:
            "Un lien pour changer de mot de passe a été envoyé à cette adresse si un bénévole s'est inscrit avec. 📨",
          messageDuration: 10000,
        }
      );

      if (!res) return;

      setTimeout(async () => {
        await this.$router.push({
          path: "/",
        });
      }, 10000);
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
