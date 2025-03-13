<template>
  <v-card class="home-card">
    <v-card-title class="home-card__title">
      <v-icon>{{ icon }}</v-icon>
      <span> {{ title }} </span>
    </v-card-title>
    <v-card-text class="home-card__content">
      <div v-if="isEnrolled">
        <p>Bravo, tu as été accepté dans l'équipe bénévole !</p>
        <p>
          Reste connecté, l'équipe responsable des bénévoles te concocte un
          planning aux petits oignons. 🧑‍💻
        </p>
        <p>
          En attendant, tu peux
          <nuxt-link :to="AVAILABILITIES_URL">
            ajouter des disponibilités
          </nuxt-link>, nous donner le nom de tes amis ou encore compléter tes informations
          pour qu'on en sache plus sur toi. 🤗
        </p>
        <p>
          Si tu as besoin d'informations sur ton planning, n'hésite pas à
          <a :href="`mailto:${HUMAINS_EMAIL}`"> nous contacter</a>. 📨
        </p>
      </div>
      <div v-else>
        <p>Très bonne question !</p>
        <!-- TODO -->
      </div>
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
