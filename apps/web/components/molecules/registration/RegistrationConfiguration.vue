<template>
  <div class="registration-configuration">
    <v-text-field
      :value="registerNewAdherentLink?.href"
      outlined
      readonly
      placeholder="Pas de lien encore genere"
      label="Lien d'invitation pour les futurs adherents"
      type="text"
      :hint="expirationRegisterNewAdherentLinkDate"
      :persistent-hint="hasRegisterNewAdherentLink"
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
              @click="refreshRegisterNewAdherentLink"
            >
              mdi-refresh
            </v-icon>
          </template>
          <span>Regenerer le lien</span>
        </v-tooltip>
      </template>
    </v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { InviteNewAdherents } from "@overbookd/registration";

export default Vue.extend({
  name: "RegistrationConfiguration",
  computed: {
    registerNewAdherentLink(): URL | undefined {
      return this.$accessor.registration.inviteNewAdherentLink;
    },
    hasRegisterNewAdherentLink(): boolean {
      return this.registerNewAdherentLink !== undefined;
    },
    expirationRegisterNewAdherentLinkDate(): string {
      if (!this.registerNewAdherentLink) return "";
      return InviteNewAdherents.isLinkExpired(this.registerNewAdherentLink);
    },
  },
  mounted() {
    this.$accessor.registration.fetchInviteNewAdherentLink();
  },
  methods: {
    async copyToClipBoard() {
      if (!this.registerNewAdherentLink?.toString()) return;
      await navigator.clipboard.writeText(
        this.registerNewAdherentLink.toString(),
      );
      this.$accessor.notif.pushNotification({ message: "Lien copie ✅" });
    },
    refreshRegisterNewAdherentLink() {
      this.$accessor.registration.generateInviteNewAdherentLink();
    },
  },
});
</script>

<style lang="scss">
.registration-configuration {
  margin: 0 20px;
}
</style>
