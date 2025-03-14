<template>
  <v-card class="home-card">
    <v-card-title class="home-card__title">
      <v-icon>{{ icon }}</v-icon>
      <span> {{ title }} </span>
    </v-card-title>
    <v-card-text v-if="isEnrolled" class="home-card__text">
      <p>Bravo, <strong>tu as été accepté dans l'équipe bénévole !</strong></p>
      <p>
        Reste connecté·e, l'équipe responsable des bénévoles te concocte un
        planning aux petits oignons. 🧑‍💻
      </p>
      <p>
        En attendant, tu peux
        <nuxt-link :to="AVAILABILITIES_URL">
          <strong>ajouter des disponibilités</strong>,
        </nuxt-link>
        nous donner le <strong>nom de tes amis</strong> ou encore
        <strong>compléter tes informations</strong> pour qu'on en sache plus sur
        toi. 🤗
      </p>
      <p>
        Si tu as besoin d'informations sur ton planning, n'hésite pas à
        <a :href="`mailto:${HUMAINS_EMAIL}`"> nous contacter</a>. 📨
      </p>
    </v-card-text>
    <v-card-text v-else class="home-card__text">
      <p>Très bonne question !</p>
      <!-- TODO -->
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { BE_AFFECTED } from "@overbookd/permission";
import { AVAILABILITIES_URL } from "@overbookd/web-page";
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
</style>
