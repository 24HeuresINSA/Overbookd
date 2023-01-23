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
        :value="mFT.userInCharge"
        label="Responsable"
        :boxed="false"
        @change="onChange('userInCharge', $event)"
      ></SearchUser>
      <SearchTeam
        :value="mFT.Team"
        label="Équipe"
        :boxed="false"
        @change="onChange('Team', $event)"
      ></SearchTeam>
      <SearchSignaLocation
        :value="mFT.location"
        label="Lieux"
        :boxed="false"
        @change="onChange('location', $event)"
      ></SearchSignaLocation>
      <v-switch
        :value="mFT.isStatic"
        label="Créneaux statiques"
        @change="onChange('isStatic', $event)"
      ></v-switch>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FT } from "~/utils/models/ft";
import SearchUser from "~/components/atoms/SearchUser.vue";
import SearchSignaLocation from "~/components/atoms/SearchSignaLocation.vue";
import SearchTeam from "~/components/atoms/SearchTeam.vue";

export default Vue.extend({
  name: "FTGeneralCard",
  components: { SearchUser, SearchSignaLocation, SearchTeam },
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      if (typeof value === "boolean" && value) value = false;

      const updatedFT = { ...this.mFT, [key]: value };
      this.$accessor.FT.updateFT(updatedFT);
    },
  },
});
</script>
