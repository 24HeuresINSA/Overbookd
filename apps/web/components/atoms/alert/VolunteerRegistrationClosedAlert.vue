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
        Les inscriptions des bénévoles sont actuellement closes.
      </strong>
      <br />
      Si tu souhaites devenir organisteur·rice à l'année, contacte
      <a :href="`mailto:${SG_EMAIL}`"> le·a secrétaire général·e </a>
      pour recevoir un lien d'invitation.
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
import { LOGIN_URL } from "@overbookd/web-page";
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
