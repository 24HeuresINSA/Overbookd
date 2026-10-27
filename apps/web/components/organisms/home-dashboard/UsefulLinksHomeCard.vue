<template>
  <v-card class="home-card">
    <v-card-title class="home-card__title">
      <v-icon icon="mdi-link" />
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
            <strong> OverView</strong> </a
          >, la street view des 24 heures de l'INSA.
        </li>
        <li>
          Un problème au sein de l'asso ? Tu peux contacter la cellule écoute
          par mail
          <a href="#" @click.prevent="copyEcouteEmailToClipBoard">
            <strong>{{ ECOUTE_EMAIL }}</strong>
          </a>
          <v-icon
            icon="mdi-content-copy"
            size="small"
            class="ml-1"
            @click="copyEcouteEmailToClipBoard"
          />
          <template v-if="helplineUrl">
            ou accéder au Linktree
            <a :href="helplineUrl" target="_blank">
              <strong><u>ICI</u></strong>
            </a>
            .
          </template>
        </li>
        <li v-if="calendarUrl">
          <p>
            Pour ne rater aucun évènement important, tu peux récupérer le lien
            du
            <a href="#" @click.prevent="copyCalendarUrlToClipBoard"
              >Google Calendar</a
            >
            <v-icon
              icon="mdi-content-copy"
              size="small"
              class="ml-1"
              @click="copyCalendarUrlToClipBoard"
            />
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
import { ECOUTE_EMAIL } from "~/utils/mail/mail.constant";

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
const helplineUrl = computed<string | undefined>(
  () => configurationStore.usefulLinks.helpline,
);

const copyCalendarUrlToClipBoard = () => {
  if (!calendarUrl.value) return;
  navigator.clipboard.writeText(calendarUrl.value);
  sendInfoNotification("Lien copié ✅");
};

const copyEcouteEmailToClipBoard = () => {
  navigator.clipboard.writeText(ECOUTE_EMAIL);
  sendInfoNotification("Mail copié ✅");
};
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

li {
  margin-left: 20px;
}
</style>
