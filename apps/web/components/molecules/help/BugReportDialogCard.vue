<template>
  <DialogCard @close="close">
    <template #title>Signaler un bug</template>
    <template #content>
      <p>
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
      </p>
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
    </template>
    <template #actions>
      <div class="actions">
        <v-btn
          text="Copier l'adresse mail"
          color="secondary"
          @click="copyEmail"
        />
        <v-btn
          text="Copier le modèle"
          color="secondary"
          @click="copyIssueTemplate"
        />
        <v-btn
          text="Envoyer le mail"
          :href="`mailto:${bugReportEmail}`"
          @click="copyIssueTemplate"
        />
      </div>
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { BugReport } from "~/utils/bug-report/bug-report.constant";

const expectedBehaviour = ref<string>("");
const actualBehaviour = ref<string>("");
const stepsToReproduce = ref<string>("");

const bugReportEmail =
  "contact-project+24-heures-insa-overbookd-mono-31598236-issue-@incoming.gitlab.com";
const stepsToReproducePlaceholder = "- Étape 1\n- Étape 2\n...";

const emit = defineEmits(["close"]);
const close = () => emit("close");

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

<style lang="scss" scoped>
.actions {
  display: flex;
  gap: 10px;

  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}
</style>
