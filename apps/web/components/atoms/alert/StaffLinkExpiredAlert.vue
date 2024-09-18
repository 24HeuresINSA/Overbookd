<template>
  <v-alert
    icon="mdi-alert-octagon-outline"
    prominent
    type="error"
    class="alert"
    theme="loginTheme"
  >
    <p>
      <strong>
        Le lien pour s'inscrire en tant qu'organisateur n'est plus valable.
      </strong>
      <br />
      Contacte
      <a :href="`mailto:${SG_EMAIL}`"> le.a secrétaire général.e </a>
      pour recevoir un nouveau lien.
    </p>
    <p>
      Si tu veux t'inscrire en tant que bénévole sur le festival c'est par
      <nuxt-link :to="REGISTER_URL">ici</nuxt-link>
    </p>
    <v-btn text="Retour" class="return-btn" @click="navigateTo(LOGIN_URL)" />
  </v-alert>
</template>

<script lang="ts" setup>
import { LOGIN_URL, REGISTER_URL } from "@overbookd/web-page";
import { SG_EMAIL } from "~/utils/mail/mail.constant";
import { navigateTo } from "#app";
</script>

<style lang="scss" scoped>
.alert a {
  color: $yellow-24h;
}

.return-btn {
  margin-top: 0.5rem;
}
</style>
