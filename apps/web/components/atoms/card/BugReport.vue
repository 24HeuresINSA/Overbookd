<template>
  <v-card>
    <v-card-title>Signaler un bug ou feature request</v-card-title>
    <v-card-text>
      <h4>
        Pour signaler un bug veuillez envoie un mail à <br />
        <code>{{ bugReportEmail }}</code>
        <br />
        en précisant le problème rencontré et en joignant une capture d'écran.
        Tu peux cliquer sur le bouton "Envoyer le mail" pour ouvrir ton client
        mail. Si rien ne se passe, tu peux utiliser les deux autres bontons pour
        copier l'adresse mail et le template. <br />
        ⚠ Utilise bien le modèle pour ton mail, cela nous aide vraiment pour
        notre travail. Merci🙏
      </h4>
    </v-card-text>
    <v-card-actions class="actions">
      <v-btn
        :href="`mailto:${bugReportEmail}`"
        color="primary"
        @click="copyIssueTemplate()"
      >
        Envoyer le mail
      </v-btn>
      <v-btn color="blue-grey" @click="copyEmail">
        Copier l'adresse mail
      </v-btn>
      <v-btn color="purple" @click="copyIssueTemplate()">
        Copier le modèle
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { issueTemplate } from "~/utils/bug-report/bug-report.constant";

export default Vue.extend({
  name: "SideNav",
  data: () => ({
    askQuestion: false,
    reportBug: false,
  }),
  computed: {
    bugReportEmail(): string {
      return "contact-project+24-heures-insa-overbookd-mono-31598236-issue-@incoming.gitlab.com";
    },
  },
  methods: {
    async copyEmail() {
      await navigator.clipboard.writeText(this.bugReportEmail);
      this.$accessor.notif.pushNotification({ message: "Email copié ✅" });
    },
    async copyIssueTemplate() {
      await navigator.clipboard.writeText(issueTemplate);
      this.$accessor.notif.pushNotification({ message: "Modèle copié ✅" });
    },
  },
});
</script>

<style scoped lang="scss">
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
  justify-content: center;
}
</style>
