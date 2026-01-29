<template>
  <v-card class="home-card">
    <v-card-title class="home-card__title">
      <v-icon> mdi-link </v-icon>
      <span> Liens Utiles </span>
    </v-card-title>
    <v-card-text class="home-card__text">
      <ul>
        <li>
          Le lien du
          <a :href="WIKI_URL" target="_blank">
            <strong> Wiki du Club des 24 heures de l'INSA</strong>
          </a>
        </li>
        <li>
          <p>
            Pour ne rater aucun évènement important, tu peux récupérer le lien
            du
            <a href="#" @click="copyToClipBoard">Google Calandar</a>
            <v-icon size="small" class="ml-1" @click="copyToClipBoard">
              mdi-content-copy
            </v-icon>
            de la {{ Edition.current }}e édition.
          </p>
        </li>
        <li>
          Pour rejoindre le groupe Slack :
          <a :href="SLACK_URL" target="_blank">
            <strong> Clique ICI</strong>
          </a>
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { Edition } from "@overbookd/time";
import { WIKI_URL } from "~/utils/navigation/url.constant";
import { CALENDAR_URL } from "~/utils/navigation/url.constant";
import { SLACK_URL } from "~/utils/navigation/url.constant";

const copyToClipBoard = () => {
  navigator.clipboard.writeText(CALENDAR_URL);
  sendInfoNotification("Lien copié ✅");
};
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

li {
  margin-left: 20px;
}
</style>
