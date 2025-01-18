<template>
  <div class="sync-download-planning">
    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-if="canSyncPlanning"
          v-bind="props"
          :text="`Synchroniser ${isMe ? 'mon' : 'l\''} agenda`"
          prepend-icon="mdi-sync"
          color="secondary"
        />
      </template>
      <v-list>
        <v-list-item prepend-icon="mdi-google" @click="syncWithGoogle">
          <template #title>
            <span class="desktop-only">Avec</span> Google Calendar
          </template>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-microsoft-outlook"
          @click="syncWithMicrosoft"
        >
          <template #title>
            <span class="desktop-only">Avec</span> Microsoft Outlook
          </template>
        </v-list-item>
        <v-list-item prepend-icon="mdi-link" @click="copySyncLinkToClipboard">
          <template #title> Obtenir le lien </template>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-menu>
      <template #activator="{ props }">
        <v-btn
          v-if="canDownloadPlanning"
          v-bind="props"
          :text="`Télécharger ${isMe ? 'mon' : 'le'} planning`"
          prepend-icon="mdi-download"
          color="secondary"
        />
      </template>
      <v-list>
        <v-list-item prepend-icon="mdi-file-pdf-box" @click="downloadPdf">
          <template #title> Au format PDF </template>
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-calendar-multiselect"
          @click="downloadIcal"
        >
          <template #title> Au format ICal </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script lang="ts" setup>
import {
  AFFECT_VOLUNTEER,
  DOWNLOAD_PLANNING,
  SYNC_PLANNING,
} from "@overbookd/permission";
import { Edition } from "@overbookd/time";
import type { User } from "@overbookd/user";

const userStore = useUserStore();
const planningStore = usePlanningStore();

const loggedUser = computed<User | undefined>(() => userStore.loggedUser);
const selectedUser = computed<User | undefined>(() => userStore.selectedUser);

const isMe = computed<boolean>(
  () => !selectedUser.value || loggedUser.value?.id === selectedUser.value?.id,
);
const canDownloadPlanning = computed<boolean>(() =>
  userStore.can(isMe.value ? DOWNLOAD_PLANNING : AFFECT_VOLUNTEER),
);

const syncLink = computed<string | null>(() => planningStore.link);
const canSyncPlanning = computed<boolean>(() => userStore.can(SYNC_PLANNING));

onMounted(() => {
  if (canSyncPlanning.value) {
    planningStore.fetchSubscriptionLink();
  }
});

const syncWithGoogle = () => {
  if (!syncLink.value) return;
  const link = `https://www.google.com/calendar/render?cid=${syncLink.value}`;
  window.open(link);
};
const syncWithMicrosoft = () => {
  if (!syncLink.value) return;
  const link = `https://outlook.live.com/calendar/addcalendar?name=24%20Heures%20de%20l%27INSA%20-%20${Edition.current}e&url=${syncLink.value}`;
  window.open(link);
};

const copySyncLinkToClipboard = async () => {
  if (!syncLink.value) return;
  await navigator.clipboard.writeText(syncLink.value);
  sendSuccessNotification("Lien copié ✅");
};

const downloadPdf = () => {
  if (isMe.value) return planningStore.downloadMyPdfPlanning();
  return planningStore.downloadAllPdfPlannings([selectedUser.value!]);
};
const downloadIcal = () => {
  if (isMe.value) return planningStore.downloadMyIcalPlanning();
  return planningStore.downloadIcalPlanning(selectedUser.value!.id);
};
</script>

<style lang="scss" scoped>
.sync-download-planning {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    margin: 5px 3% 15px 3%;
  }
}
</style>
