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
          Le lien d'
          <a :href="OVERVIEW_URL" target="_blank">
            <strong> OverView</strong> </a>, la street view des 24 heures de l'INSA.
        </li>
        <li v-if="calendarUrl">
          <p>
            Pour ne rater aucun évènement important, tu peux récupérer le lien
            du
            <a href="#" @click="copyToClipBoard">Google Calendar</a>
            <v-icon size="small" class="ml-1" @click="copyToClipBoard">
              mdi-content-copy
            </v-icon>
            de la {{ Edition.current }}e édition.
          </p>
        </li>
        <li v-if="slackUrl">
          Pour rejoindre le groupe Slack :
          <a :href="slackUrl" target="_blank">
            <strong> Clique ICI</strong>
          </a>
        </li>
      </ul>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { USEFUL_LINKS_KEY } from "@overbookd/configuration";
import { Edition } from "@overbookd/time";
import { WIKI_URL } from "~/utils/navigation/url.constant";
import { OVERVIEW_URL } from "~/utils/navigation/url.constant";

const configurationStore = useConfigurationStore();

onMounted(() => {
  if (!configurationStore.get(USEFUL_LINKS_KEY)) {
    configurationStore.fetch(USEFUL_LINKS_KEY);
  }
});

const calendarUrl = computed<string | undefined>(
  () => configurationStore.usefulLinks.googleCalendar,
);
const slackUrl = computed<string | undefined>(
  () => configurationStore.usefulLinks.slack,
);

const copyToClipBoard = () => {
  if (!calendarUrl.value) return;
  navigator.clipboard.writeText(calendarUrl.value);
  sendInfoNotification("Lien copié ✅");
};
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

li {
  margin-left: 20px;
}
</style>
