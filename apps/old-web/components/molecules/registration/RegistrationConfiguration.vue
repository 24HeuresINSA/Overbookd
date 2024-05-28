<template>
  <div class="registration-configuration">
    <v-text-field
      :value="inviteStaffLink?.href"
      outlined
      readonly
      placeholder="Pas de lien encore généré"
      label="Lien d'invitation pour les futurs organisateurs"
      type="text"
      :hint="expirationInviteStaffLinkDate"
      :persistent-hint="hasInviteStaffLink"
    >
      <template #append>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon right v-bind="attrs" v-on="on" @click="copyToClipBoard">
              mdi-content-copy
            </v-icon>
          </template>
          <span>Copier le lien</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              right
              v-bind="attrs"
              v-on="on"
              @click="refreshInviteStaffLink"
            >
              mdi-refresh
            </v-icon>
          </template>
          <span>Régénérer le lien</span>
        </v-tooltip>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { InviteStaff } from "@overbookd/registration";

export default Vue.extend({
  name: "RegistrationConfiguration",
  computed: {
    inviteStaffLink(): URL | undefined {
      return this.$accessor.registration.inviteStaffLink;
    },
    hasInviteStaffLink(): boolean {
      return this.inviteStaffLink !== undefined;
    },
    expirationInviteStaffLinkDate(): string {
      if (!this.inviteStaffLink) return "";
      return InviteStaff.isLinkExpired(this.inviteStaffLink);
    },
  },
  mounted() {
    this.$accessor.registration.fetchInviteStaffLink();
  },
  methods: {
    async copyToClipBoard() {
      if (!this.inviteStaffLink?.toString()) return;
      await navigator.clipboard.writeText(this.inviteStaffLink.toString());
      this.$accessor.notif.pushNotification({ message: "Lien copié ✅" });
    },
    refreshInviteStaffLink() {
      this.$accessor.registration.generateInviteStaffLink();
    },
  },
});
</script>

<style lang="scss">
.registration-configuration {
  margin: 0 20px;
}
</style>
