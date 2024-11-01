<template>
  <v-card>
    <v-card-title>Lien d'invitation</v-card-title>
    <v-card-text>
      <v-text-field
        :model-value="inviteStaffLink?.href"
        label="Lien d'invitation pour les futurs organisateurs"
        placeholder="Pas de lien encore généré"
        :hint="expirationInviteStaffLinkDate"
        :persistent-hint="hasInviteStaffLink"
        class="mt-1"
        readonly
      >
        <template #append>
          <v-btn
            v-tooltip:top="'Copier le lien'"
            icon="mdi-content-copy"
            variant="flat"
            density="comfortable"
            @click="copyToClipBoard"
          />
          <v-btn
            v-tooltip:top="'Régénérer le lien'"
            icon="mdi-refresh"
            variant="flat"
            density="comfortable"
            @click="refreshInviteStaffLink"
          />
        </template>
      </v-text-field>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { InviteStaff } from "@overbookd/registration";

const membershipApplicationStore = useMembershipApplicationStore();

membershipApplicationStore.fetchInviteStaffLink();

const inviteStaffLink = computed<URL | undefined>(
  () => membershipApplicationStore.inviteStaffLink,
);
const hasInviteStaffLink = computed<boolean>(() => !!inviteStaffLink.value);
const expirationInviteStaffLinkDate = computed<string>(() => {
  if (!inviteStaffLink.value) return "";
  return InviteStaff.isLinkExpired(inviteStaffLink.value);
});

const copyToClipBoard = async () => {
  if (!inviteStaffLink.value?.toString()) return;
  await navigator.clipboard.writeText(inviteStaffLink.value.toString());
  sendSuccessNotification("Lien copié");
};
const refreshInviteStaffLink = () =>
  membershipApplicationStore.generateInviteStaffLink();
</script>
