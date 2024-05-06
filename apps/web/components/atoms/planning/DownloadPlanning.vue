<template>
  <div v-if="canDowloadPlanning || canSyncPlanning">
    <v-list dense>
      <v-list-group id="retrieve-planning" prepend-icon="mdi-calendar">
        <template #activator>
          <v-list-item-title>
            Récupérer
            {{ isMe ? "mon" : "le" }} planning
          </v-list-item-title>
        </template>
        <v-list-group v-if="canSyncPlanning" no-action sub-group>
          <template #activator>
            <v-list-item-title>
              <v-icon>mdi-sync</v-icon>
              Synchroniser <span class="desktop">mon agenda</span>
            </v-list-item-title>
          </template>
          <v-list-item link @click="syncWithGoogle">
            <v-list-item-icon>
              <v-icon>mdi-google</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              <span class="desktop">Avec</span> Google Calendar
            </v-list-item-title>
          </v-list-item>
          <v-list-item link @click="syncWithMicrosoft">
            <v-list-item-icon>
              <v-icon>mdi-microsoft-outlook</v-icon>
            </v-list-item-icon>
            <v-list-item-title
              ><span class="desktop">Avec</span> Microsoft Outlook
            </v-list-item-title>
          </v-list-item>
          <v-list-item link @click="copySyncLinkToClipboard">
            <v-list-item-icon>
              <v-icon>mdi-link</v-icon>
            </v-list-item-icon>
            <v-list-item-title>
              Obtenir le lien <span class="desktop"> de synchronisation</span>
            </v-list-item-title>
          </v-list-item>
        </v-list-group>
        <v-list-group v-if="canDowloadPlanning" no-action sub-group>
          <template #activator>
            <v-list-item-title>
              <v-icon>mdi-download</v-icon>
              Télécharger
            </v-list-item-title>
          </template>
          <v-list-item link @click="downloadPdf">
            <v-list-item-icon>
              <v-icon>mdi-file-pdf-box</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Au format PDF</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="downloadIcal">
            <v-list-item-icon>
              <v-icon>mdi-calendar-multiselect</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Au format ICal</v-list-item-title>
          </v-list-item>
        </v-list-group>
      </v-list-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  AFFECT_VOLUNTEER,
  DOWNLOAD_PLANNING,
  SYNC_PLANNING,
} from "@overbookd/permission";
import { User, UserPersonalData } from "@overbookd/user";
import { Edition } from "@overbookd/contribution";

export default defineComponent({
  name: "DownloadPlanning",
  computed: {
    me(): User {
      return this.$accessor.user.me;
    },
    user(): UserPersonalData {
      return this.$accessor.user.selectedUser;
    },
    syncLink() {
      return this.$accessor.planning.link;
    },
    isMe(): boolean {
      return this.me.id === this.user.id;
    },
    canDowloadPlanning(): boolean {
      if (!this.isMe) {
        return this.$accessor.user.can(AFFECT_VOLUNTEER);
      }
      return this.$accessor.user.can(DOWNLOAD_PLANNING);
    },
    canSyncPlanning(): boolean {
      return this.$accessor.user.can(SYNC_PLANNING);
    },
  },
  methods: {
    syncWithGoogle() {
      if (!this.syncLink) return;
      const link = `https://www.google.com/calendar/render?cid=${this.syncLink}`;
      window.open(link, "_blank");
    },
    syncWithMicrosoft() {
      if (!this.syncLink) return;
      const link = `https://outlook.live.com/calendar/addcalendar?name=24%20Heures%20de%20l%27INSA%20-%20${Edition.current}e&url=${this.syncLink}`;
      window.open(link, "_blank");
    },
    async copySyncLinkToClipboard() {
      if (!this.syncLink) return;
      await navigator.clipboard.writeText(this.syncLink);
      this.$accessor.notif.pushNotification({ message: "Lien copié ✅" });
    },
    async downloadPdf() {
      if (this.isMe) {
        return this.$accessor.planning.downloadMyPdfPlanning();
      }
      return this.$accessor.planning.downloadAllPdfPlannings([this.user]);
    },
    async downloadIcal() {
      if (this.isMe) {
        return this.$accessor.planning.downloadMyIcalPlanning();
      }
      return this.$accessor.planning.downloadIcalPlanning(this.user.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.desktop {
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
}
</style>

<style lang="scss">
#retrieve-planning {
  .v-list-group__header__prepend-icon {
    margin-right: 16px;
  }
}
</style>
