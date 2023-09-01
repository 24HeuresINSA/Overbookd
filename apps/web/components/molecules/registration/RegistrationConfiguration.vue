<template>
  <div class="registration-configuration">
    <v-text-field
      :value="registerNewAdherentLink"
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
import jwt_decode from "jwt-decode";
import { formatDateWithExplicitMonthAndDay } from "~/utils/date/date.utils";

export default Vue.extend({
  name: "RegistrationConfiguration",
  computed: {
    registerNewAdherentLink(): URL | undefined {
      return new URL(
        "https://overbookd.24heures.org/register?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTgwMTkyMDAwMDB9.Q6phgjNeHv116a9MHqTbodTZfpf76SFZlRrxVo3eU88",
      );
    },
    hasRegisterNewAdherentLink(): boolean {
      return this.registerNewAdherentLink !== undefined;
    },
    expirationRegisterNewAdherentLinkDate(): string {
      if (!this.registerNewAdherentLink) return "";
      const token = this.registerNewAdherentLink.searchParams.get("token");
      if (!token) return "";
      const { exp } = jwt_decode<{ exp: number }>(token);
      const expirationDate = new Date(exp);
      return `Ce lien expire le ${formatDateWithExplicitMonthAndDay(
        expirationDate,
      )}`;
    },
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
      console.log("refresh");
    },
  },
});
</script>

<style lang="scss">
.registration-configuration {
  margin: 0 20px;
}
</style>
