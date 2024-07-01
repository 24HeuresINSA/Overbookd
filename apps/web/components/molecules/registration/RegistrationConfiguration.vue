<template>
  <div class="registration-configuration">
    <v-text-field
      :model-value="inviteStaffLink?.href"
      label="Lien d'invitation pour les futurs organisateurs"
      placeholder="Pas de lien encore généré"
      :hint="expirationInviteStaffLinkDate"
      :persistent-hint="hasInviteStaffLink"
      readonly
    >
      <template #append>
        <v-tooltip text="Copier le lien" location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-content-copy"
              variant="flat"
              density="comfortable"
              @click="copyToClipBoard"
            />
          </template>
        </v-tooltip>

        <v-tooltip text="Régénérer le lien" location="top">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-refresh"
              variant="flat"
              density="comfortable"
              @click="refreshInviteStaffLink"
            />
          </template>
        </v-tooltip>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts" setup>
import { InviteStaff } from "@overbookd/registration";
import { sendNotification } from "~/utils/notification/send-notification";

const registrationStore = useRegistrationStore();

registrationStore.fetchInviteStaffLink();

const inviteStaffLink = computed(() => registrationStore.inviteStaffLink);
const hasInviteStaffLink = computed(() => inviteStaffLink.value !== undefined);
const expirationInviteStaffLinkDate = computed(() => {
  if (!inviteStaffLink.value) return "";
  return InviteStaff.isLinkExpired(inviteStaffLink.value);
});

const copyToClipBoard = async () => {
  if (!inviteStaffLink.value?.toString()) return;
  await navigator.clipboard.writeText(inviteStaffLink.value.toString());
  sendNotification("Lien copié ✅");
};
const refreshInviteStaffLink = () =>
  registrationStore.generateInviteStaffLink();
</script>

<style lang="scss">
.registration-configuration {
  margin: 0 20px;
}
</style>
