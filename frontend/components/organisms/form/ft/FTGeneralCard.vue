<template>
  <v-card>
    <v-card-title>Général</v-card-title>
    <v-card-text>
      <v-text-field
        :value="mFT.name"
        label="Nom de la FT"
        @change="onChange('name', $event)"
      ></v-text-field>
      <SearchUser
        :value="mFT.inCharge"
        label="Responsable"
        :boxed="false"
        @change="onChange('inCharge', $event)"
      ></SearchUser>
      <SearchTeam
        :value="mFT.team"
        label="Équipe"
        :boxed="false"
        @change="onChange('team', $event)"
      ></SearchTeam>
      <SearchSignaLocations
        :value="mFT.locations"
        label="Lieux"
        :boxed="false"
        @change="onChange('locations', $event)"
      ></SearchSignaLocations>
      <v-switch
        :value="mFT.areStatic"
        label="Créneaux statiques"
        @change="onChange('areStatic', $event)"
      ></v-switch>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FT } from "~/utils/models/ft";
import SearchUser from "~/components/atoms/SearchUser.vue";
import SearchSignaLocations from "~/components/atoms/SearchSignaLocations.vue";
import SearchTeam from "~/components/atoms/SearchTeam.vue";

export default Vue.extend({
  name: "FTGeneralCard",
  components: { SearchUser, SearchSignaLocations, SearchTeam },
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      const updatedFT = { ...this.mFT, [key]: value };
      this.$accessor.FT.setFT(updatedFT);
    },
  },
});
</script>

<style scoped></style>
