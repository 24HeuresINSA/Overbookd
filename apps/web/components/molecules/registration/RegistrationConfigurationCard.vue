<template>
  <v-card>
    <v-card-title>Lien d'invitation</v-card-title>
    <v-card-text>
      <v-text-field
        :model-value="inviteStaffLink?.href"
        label="Lien d'invitation pour les futurs organisateur·rice·s"
        placeholder="Pas de lien encore généré"
        :hint="expirationInviteStaffLinkDate"
        :persistent-hint="hasInviteStaffLink"
        class="mt-1"
        readonly
      >
        <template #append>
          <v-btn
            icon="mdi-content-copy"
            aria-label="Copier le lien"
            title="Copier le lien"
            variant="flat"
            density="comfortable"
            @click="copyInviteStaffLink"
          />
          <v-btn
            icon="mdi-refresh"
            aria-label="Régénérer le lien"
            title="Régénérer le lien"
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
import { copyToClipboard } from "~/utils/clipboard";

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

const copyInviteStaffLink = () => {
  if (!inviteStaffLink.value?.toString()) return;
  copyToClipboard(inviteStaffLink.value.toString(), "Lien copié ✅");
};
const refreshInviteStaffLink = () =>
  membershipApplicationStore.generateInviteStaffLink();
</script>
