<template>
  <v-card>
    <v-card-title>Signaler un bug ou feature request</v-card-title>
    <v-card-text>
      <h4>
        Pour signaler un bug veuillez envoyer un mail à <br />
        <code>{{ bugReportEmail }}</code>
        <br />
        en précisant le problème rencontré et en joignant une capture d'écran.
        <br />
        Tu peux cliquer sur le bouton "Envoyer le mail" pour ouvrir ton client
        mail. Si rien ne se passe, tu peux utiliser les deux autres bontons pour
        copier l'adresse mail et le template. <br />
        ⚠️ Le formulaire ci-dessous permet de remplir le modèle. Utilise le bien
        pour ton mail, cela nous aide vraiment pour notre travail. Merci 🙏
      </h4>
    </v-card-text>
    <v-card-text>
      <v-textarea
        class="expected-behaviour-input"
        label="Comportement attendu"
        no-resize="true"
        rows="4"
        @change="updateExpectedBehaviour"
      />
      <v-textarea
        class="actual-behaviour-input"
        label="Comportement constaté"
        no-resize="true"
        rows="4"
        @change="updateActualBehaviour"
      />
      <v-textarea
        class="steps-to-reproduce-input"
        label="Étapes pour reproduire"
        :placeholder="stepsToReproducePlaceholder"
        no-resize="true"
        rows="4"
        @change="updateStepsToReproduce"
      />
    </v-card-text>
    <v-card-actions class="actions">
      <v-btn id="copy-email-button" @click="copyEmail">
        Copier l'adresse mail
      </v-btn>
      <v-btn id="copy-template-button" @click="copyIssueTemplate">
        Copier le modèle
      </v-btn>
      <v-btn
        id="send-email-button"
        :href="`mailto:${bugReportEmail}`"
        @click="copyIssueTemplate"
      >
        Envoyer le mail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { BugReport } from "~/utils/bug-report/bug-report.constant";

export default Vue.extend({
  name: "BugReport",
  data: () => ({
    askQuestion: false,
    reportBug: false,
    expectedBehaviour: "",
    actualBehaviour: "",
    stepsToReproduce: "",
  }),
  computed: {
    bugReportEmail(): string {
      return "contact-project+24-heures-insa-overbookd-mono-31598236-issue-@incoming.gitlab.com";
    },
    stepsToReproducePlaceholder(): string {
      return "- Étape 1\n- Étape 2\n...";
    },
  },
  methods: {
    updateExpectedBehaviour(expectedBehaviour: string) {
      this.expectedBehaviour = expectedBehaviour;
    },
    updateActualBehaviour(actualBehaviour: string) {
      this.actualBehaviour = actualBehaviour;
    },
    updateStepsToReproduce(stepsToReproduce: string) {
      this.stepsToReproduce = stepsToReproduce;
    },
    async copyEmail() {
      await navigator.clipboard.writeText(this.bugReportEmail);
      this.$accessor.notif.pushNotification({ message: "Email copié ✅" });
    },
    async copyIssueTemplate() {
      await navigator.clipboard.writeText(
        BugReport.template(
          this.expectedBehaviour,
          this.actualBehaviour,
          this.stepsToReproduce,
        ),
      );
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

  #send-email-button {
    background-color: deepskyblue;
  }

  #copy-email-button,
  #copy-template-button {
    background-color: orange;
  }
}
</style>
