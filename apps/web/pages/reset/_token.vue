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
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { safeCall } from "~/utils/api/calls";
import { Snack } from "~/utils/models/snack.model";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { AuthRepository } from "~/repositories/auth.repository";

export default Vue.extend({
  name: "ForgotPassword",
  components: { SnackNotificationContainer },
  auth: false,
  layout: "none",
  data: () => ({
    password: "",
    password2: "",
    snack: new Snack(3000),
    passwordVerif: [
      (v: string) =>
        new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$").test(v) ||
        "au moins 8 caractères avec une MAJUSCULE, une minuscule et un chiffre minimum",
    ],
  }),
  methods: {
    sendResetRequest: async function () {
      const res = await safeCall(
        this.$store,
        AuthRepository.resetPassword(this, {
          token: this.$route.params.token,
          password: this.password,
          password2: this.password2,
        }),
        {
          successMessage: "Password changé, redirection au login...",
          messageDuration: 10000,
        },
      );

      if (!res) return;
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
