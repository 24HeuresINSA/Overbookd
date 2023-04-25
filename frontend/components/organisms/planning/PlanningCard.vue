<template>
  <v-card>
    <v-card-title>Mon planning </v-card-title>
    <v-card-text v-if="canViewPlanning">
      <p>
        Ceci est un planning <strong> provisoire</strong>, ça signifie qu'il est
        susceptible d'être mis à jour. 🪄
      </p>
      <p>
        Pour éviter toute déconvenue nous te conseillons de
        <strong>
          synchroniser ton planning avec ton application d'agenda.
        </strong>
        🤓
      </p>
      <p>
        Pour réaliser cette opération tu auras besoin du lien vers
        <a :href="personnalLink">ton planning personnel</a>
        <v-icon right @click="copyToClipBoard">mdi-content-copy</v-icon>
      </p>
      <p>
        Ce lien sera nécesssaire pour configurer la synchronisation avec ton
        application d'agenda.<br />
        Voici une liste d'applications supportant cette synchronisation:
      </p>
      <ul>
        <li>
          <a
            href="https://support.google.com/calendar/answer/37100"
            target="_blank"
          >
            Google
          </a>
          <span>(section 'Use a link to add a public calendar')</span>
        </li>
        <li>
          <a
            href="https://proton.me/support/subscribe-to-external-calendar#subscribe-external-link"
            target="_blank"
          >
            Proton
          </a>
        </li>
        <li>
          <a
            href="https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-on-the-web-503ffaf6-7b86-44fe-8dd6-8099d95f38df"
            target="_blank"
          >
            Outlook
          </a>
          <span>(section 'Subscribe to a calendar')</span>
        </li>
        <li>
          <a
            href="https://support.mozilla.org/en-US/kb/adding-a-holiday-calendar"
            target="_blank"
          >
            Mozilla
          </a>
          <span>(section 'Subscribe to it on the internet')</span>
        </li>
      </ul>
    </v-card-text>
    <v-card-text v-else>
      <p>Tu n'as pas encore accès à ton planning. 😅</p>
      <p>
        L'équipe responsable des bénévoles le peaufine encore pour qu'il soit
        aux petits oignons. 🧑‍💻
      </p>
      <p>
        Si tu as besoin d'informations sur ton planning, n'hésite pas à
        <a href="mailto:humains@24heures.org">les contacter</a>. 📨
      </p>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="exportPlanning">
        Télécharger mon planning
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { download } from "~/utils/planning/download";

export default Vue.extend({
  name: "PlanningCard",
  computed: {
    me() {
      return this.$accessor.user.me;
    },
    canViewPlanning(): boolean {
      return this.$accessor.user.hasPermission("can-view-planning");
    },
    personnalLink(): string {
      return this.$accessor.planning.link ?? "";
    },
    planningBase64Data(): string {
      return this.$accessor.planning.planningBase64Data;
    },
  },
  async created() {
    await this.$accessor.planning.fetchSubscriptionLink();
  },
  methods: {
    async exportPlanning() {
      await this.$accessor.planning.fetchMyPdfPlanning();
      download(this.planningBase64Data, this.me);
    },
    async copyToClipBoard() {
      await navigator.clipboard.writeText(this.personnalLink);
      this.$accessor.notif.pushNotification({ message: "Lien copie ✅" });
    },
  },
});
</script>
