<template>
  <v-card class="home-card">
    <v-card-title class="home-card__title">
      <v-icon>mdi-calendar-clock</v-icon>
      <span> Ton planning est disponible ! </span>
    </v-card-title>
    <v-card-text class="home-card__text">
      <p>
        C'est un planning <strong> définitif</strong>, cependant des imprévus
        peuvent entrainer des mises à jour. 😞
      </p>
      <p>
        Pour éviter toute déconvenue, nous te conseillons de
        <strong>
          synchroniser ton planning avec ton application d'agenda.
        </strong>
        🤓
      </p>
      <p>
        Pour réaliser cette opération tu auras besoin du lien vers
        <a href="#" @click="copyToClipBoard">ton planning personnel</a>
        <v-icon size="small" class="ml-1" @click="copyToClipBoard">
          mdi-content-copy
        </v-icon>
      </p>
      <p>
        Ce lien sera nécesssaire pour configurer la synchronisation avec ton
        agenda (on te conseile de faire ça sur PC).<br />
        Voici une liste d'applications supportant cette synchronisation :
      </p>
      <ul>
        <li>
          <span class="row">
            <a :href="HELP_LINK.google" target="_blank"> Google </a>
            <span>(section 'Use a link to add a public calendar')</span>
          </span>
          <span class="row">
            <span> Ou directement : </span>
            <a :href="googleLink" target="_blank">
              Synchroniser avec Google Calendar
            </a>
          </span>
        </li>
        <li>
          <span class="row">
            <a :href="appleLink"> Apple </a>
            <span>(ouvre directement dans Calendrier)</span>
          </span>
        </li>
        <li>
          <a :href="HELP_LINK.proton" target="_blank"> Proton </a>
        </li>
        <li>
          <span class="row">
            <a :href="HELP_LINK.outlook" target="_blank"> Outlook </a>
            <span>(section 'Subscribe to a calendar')</span>
          </span>
          <span class="row">
            <span> Ou directement : </span>
            <a :href="outlookLink" target="_blank">
              Synchroniser avec Microsoft Outlook
            </a>
          </span>
        </li>
        <li>
          <span class="row">
            <a :href="HELP_LINK.mozilla" target="_blank"> Mozilla </a>
            <span>(section 'Subscribe to it on the internet')</span>
          </span>
        </li>
      </ul>
    </v-card-text>
    <v-card-actions class="home-card__actions">
      <v-btn
        text="Télécharger mon planning PDF"
        color="secondary"
        :loading="downloading"
        @click="exportPlanning"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { DOWNLOAD_PLANNING } from "@overbookd/permission";
import { Edition } from "@overbookd/time";

const HELP_LINK = {
  google: "https://support.google.com/calendar/answer/37100",
  proton:
    "https://proton.me/support/subscribe-to-external-calendar#subscribe-external-link",
  outlook:
    "https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-on-the-web-503ffaf6-7b86-44fe-8dd6-8099d95f38df",
  mozilla: "https://support.mozilla.org/en-US/kb/adding-a-holiday-calendar",
};

const userStore = useUserStore();
const planningStore = usePlanningStore();
const downloading = ref(false);

onMounted(async () => {
  await planningStore.fetchSubscriptionLink();
});
const personalLink = computed<string>(() => planningStore.link ?? "");

const googleLink = computed<string>(() => {
  if (!personalLink.value) return "#";
  return `https://www.google.com/calendar/render?cid=${personalLink.value}`;
});
const appleLink = computed<string>(() => {
  if (!personalLink.value) return "#";
  return `${personalLink.value}?plaintext=true`;
});
const outlookLink = computed<string>(() => {
  if (!personalLink.value) return "#";
  return `https://outlook.live.com/calendar/addcalendar?name=24%20Heures%20de%20l%27INSA%20-%20${Edition.current}e&url=${personalLink.value}`;
});

const copyToClipBoard = () => {
  navigator.clipboard.writeText(personalLink.value);
  sendInfoNotification("Lien copié ✅");
};

const exportPlanning = async () => {
  if (!userStore.can(DOWNLOAD_PLANNING)) return;
  downloading.value = true;
  await planningStore
    .downloadMyPdfPlanning()
    .finally(() => (downloading.value = false));
};
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

.home-card {
  &__text {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;
    padding-bottom: 10px;
  }

  &__actions {
    display: flex;
    justify-content: center;
  }
}

li {
  margin-left: 20px;

  &:not(:first-child) {
    margin-top: 5px;
  }

  .row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
