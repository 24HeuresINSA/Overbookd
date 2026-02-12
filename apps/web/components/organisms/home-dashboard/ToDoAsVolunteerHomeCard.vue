<template>
  <v-card class="home-card">
    <v-card-title class="home-card__title">
      <v-icon>{{ icon }}</v-icon>
      <span> {{ title }} </span>
    </v-card-title>
    <v-card-text class="home-card__text">
      <span v-if="isEnrolled">
        <p>
          Bravo, <strong>tu as été accepté·e dans l'équipe bénévole !</strong>
        </p>
        <p>
          Reste connecté·e, l'équipe responsable des bénévoles te concocte un
          planning aux petits oignons. 🧑‍💻
        </p>
        <p>En attendant, tu peux :</p>
      </span>
      <span v-else>
        <p>Bienvenue sur Overbookd, le site d'inscription des bénévoles !</p>
        <p>
          Tu veux profiter du festival en étant du meilleur côté ? Tu vas voir,
          c'est plutôt simple. Voici ce que tu peux faire pour
          <strong>maximiser tes chances d'être accepté dans l'équipe :</strong>
        </p>
      </span>

      <ul>
        <li>
          <nuxt-link :to="AVAILABILITIES_URL">
            Renseigner <strong>tes disponibilités</strong>
          </nuxt-link>
        </li>
        <li>Nous donner le <strong>nom de tes amis</strong></li>
        <li>
          <strong>Compléter tes informations</strong> pour qu'on en sache plus
          sur toi. 🤗
        </li>
        <li v-if="!isEnrolled">
          <nuxt-link :to="VOLUNTEER_CHARTER_URL">
            Lire et signer <strong>la Charte Bénévole</strong>
          </nuxt-link>
        </li>
      </ul>

      <p>
        Si tu as des questions, n'hésite pas à
        <a :href="`mailto:${HUMAINS_EMAIL}`"> nous contacter</a>. 📨
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { BE_AFFECTED } from "@overbookd/permission";
import { AVAILABILITIES_URL, VOLUNTEER_CHARTER_URL } from "@overbookd/web-page";
import { HUMAINS_EMAIL } from "~/utils/mail/mail.constant";

const userStore = useUserStore();

const isEnrolled = computed<boolean>(() => userStore.can(BE_AFFECTED));

const title = computed<string>(() =>
  isEnrolled.value ? "Bienvenue dans l'équipe !" : "Comment devenir bénévole ?",
);
const icon = computed<string>(() =>
  isEnrolled.value ? "mdi-account-check" : "mdi-account-question",
);
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

li {
  margin-left: 20px;
}
</style>
