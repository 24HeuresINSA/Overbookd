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
        Le lien pour s'inscrire en tant qu'organisateur·rice n'est plus valable.
      </strong>
      <br />
      Contacte
      <a :href="`mailto:${SG_EMAIL}`"> le·a secrétaire général·e </a>
      pour recevoir un nouveau lien.
    </p>
    <p>
      Si tu veux t'inscrire en tant que bénévole sur le festival c'est par
      <NuxtLink text="ici" :to="REGISTER_URL" />
    </p>
    <div class="action-buttons">
      <v-btn
        v-if="loggedIn"
        text="Se déconnecter"
        prepend-icon="mdi-logout"
        @click="handleLogout"
      />
      <v-btn v-else text="Retour" @click="returnToLoginPage" />
    </div>
  </v-alert>
</template>

<script lang="ts" setup>
import { LOGIN_URL, REGISTER_URL } from "@overbookd/web-page";
import { useOidcUtils } from "~/composable/useOidcUtils";
import { SG_EMAIL } from "~/utils/mail/mail.constant";
import { openPage } from "~/utils/navigation/router.utils";

const { loggedIn } = useOidcAuth();
const { handleLogout } = useOidcUtils();

const returnToLoginPage = (event: PointerEvent) => {
  openPage(event, LOGIN_URL);
};
</script>

<style lang="scss" scoped>
.alert {
  flex: none;
  a {
    color: $yellow-24h;
  }
}

.action-buttons {
  margin-top: 0.5rem;
}
</style>
