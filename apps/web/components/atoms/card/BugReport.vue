<template>
  <v-card>
    <v-card-title>Signaler un bug ou feature request</v-card-title>
    <v-card-text>
      <h5>
        Pour signaler un bug, envoie un mail à <br />
        <code>{{ bugReportEmail }}</code>
        <br />
        en précisant le problème rencontré et en joignant une capture d'écran.
        <br />
        Tu peux cliquer sur le bouton "Envoyer le mail" pour ouvrir ton client
        mail. Si rien ne se passe, tu peux utiliser les deux autres bontons pour
        copier l'adresse mail et le template. <br />
        ⚠️ Le formulaire ci-dessous permet de remplir le modèle. Utilise le bien
        pour ton mail, cela nous aide vraiment pour notre travail. Merci 🙏
      </h5>
    </v-card-text>
    <v-card-text>
      <v-textarea
        v-model="expectedBehaviour"
        class="expected-behaviour-input"
        label="Comportement attendu"
        no-resize
        rows="4"
      />
      <v-textarea
        v-model="actualBehaviour"
        class="actual-behaviour-input"
        label="Comportement constaté"
        no-resize
        rows="4"
      />
      <v-textarea
        v-model="stepsToReproduce"
        class="steps-to-reproduce-input"
        label="Étapes pour reproduire"
        :placeholder="stepsToReproducePlaceholder"
        no-resize
        rows="4"
      />
    </v-card-text>
    <v-card-actions id="actions">
      <v-btn id="copy-email-button" variant="elevated" @click="copyEmail">
        Copier l'adresse mail
      </v-btn>
      <v-btn
        id="copy-template-button"
        variant="elevated"
        @click="copyIssueTemplate"
      >
        Copier le modèle
      </v-btn>
      <v-btn
        id="send-email-button"
        variant="elevated"
        :href="`mailto:${bugReportEmail}`"
        @click="copyIssueTemplate"
      >
        Envoyer le mail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { BugReport } from "~/utils/bug-report/bug-report.constant";

const expectedBehaviour = ref("");
const actualBehaviour = ref("");
const stepsToReproduce = ref("");

const bugReportEmail =
  "contact-project+24-heures-insa-overbookd-mono-31598236-issue-@incoming.gitlab.com";
const stepsToReproducePlaceholder = "- Étape 1\n- Étape 2\n...";

const copyEmail = async () => {
  await navigator.clipboard.writeText(bugReportEmail);
  sendSuccessNotification("Email copié ✅");
};

const copyIssueTemplate = async () => {
  await navigator.clipboard.writeText(
    BugReport.template(
      expectedBehaviour.value,
      actualBehaviour.value,
      stepsToReproduce.value,
    ),
  );
  sendSuccessNotification("Modèle copié ✅");
};
</script>

<style scoped lang="scss">
#actions {
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
  align-items: center;
  justify-content: center;

  #copy-email-button,
  #copy-template-button {
    background-color: orange;
  }

  #send-email-button {
    background-color: deepskyblue;
  }
}
</style>
