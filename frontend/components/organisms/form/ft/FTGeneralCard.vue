<template>
  <v-card :class="validationStatus">
    <CardErrorList festival-event="FT" :type="cardType" />
    <v-card-title>Général</v-card-title>
    <v-card-text>
      <v-text-field
        :value="mFT.name"
        label="Nom de la FT"
        :disabled="isValidatedByOwner"
        @change="updateName($event)"
      ></v-text-field>
      <SearchUser
        :user="mFT.userInCharge"
        label="Responsable"
        :boxed="false"
        :disabled="isValidatedByOwner"
        @change="updateUserInCharge($event)"
      ></SearchUser>
      <SearchTeam
        :team="mFT.team"
        label="Équipe"
        :boxed="false"
        :disabled="isValidatedByOwner"
        @change="updateTeam($event)"
      ></SearchTeam>
      <SearchSignaLocation
        :location="mFT.location"
        label="Lieu de rendez-vous"
        :boxed="false"
        :disabled="isValidatedByOwner"
        @change="updateLocation($event)"
      ></SearchSignaLocation>
      <v-switch
        :input-value="mFT.isStatic"
        label="Créneaux statiques"
        :disabled="isValidatedByOwner"
        @change="updateIsStatic($event)"
      ></v-switch>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FT, FTCardType } from "~/utils/models/ft";
import SearchUser from "~/components/atoms/SearchUser.vue";
import SearchSignaLocation from "~/components/atoms/SearchSignaLocation.vue";
import SearchTeam from "~/components/atoms/SearchTeam.vue";
import { User } from "~/utils/models/user";
import { Team } from "~/utils/models/team";
import { SignaLocation } from "~/utils/models/signaLocation";
import CardErrorList from "~/components/molecules/CardErrorList.vue";
import {
  getFTValidationStatus,
  isTaskValidatedBy,
} from "~/utils/festivalEvent/ftUtils";

export default Vue.extend({
  name: "FTGeneralCard",
  components: { SearchUser, SearchSignaLocation, SearchTeam, CardErrorList },
  data: () => ({
    owner: "humain",
    cardType: FTCardType.GENERAL,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    isValidatedByOwner(): boolean {
      return isTaskValidatedBy(this.mFT.reviews, this.owner);
    },
    validationStatus(): string {
      return getFTValidationStatus(this.mFT, this.owner).toLowerCase();
    },
  },
  methods: {
    updateName(name: string) {
      return this.updateFT({ name: name.trim() });
    },
    updateUserInCharge(userInCharge: User | null) {
      return this.updateFT({ userInCharge: userInCharge ?? undefined });
    },
    updateTeam(team: Team | null) {
      return this.updateFT({ team: team ?? undefined });
    },
    updateLocation(location: SignaLocation | null) {
      return this.updateFT({ location: location ?? undefined });
    },
    updateIsStatic(isStatic: boolean | null) {
      return this.updateFT({ isStatic: isStatic === true });
    },
    updateFT(ftChunk: Partial<FT>) {
      this.$accessor.FT.updateFT({ ...this.mFT, ...ftChunk });
    },
  },
});
</script>
