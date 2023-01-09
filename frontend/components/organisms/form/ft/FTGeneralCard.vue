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
      <v-switch
        :value="mFT.areStatic"
        label="Créneaux statiques"
        @change="onChange('areStatic', $event)"
      ></v-switch>
      <v-autocomplete
        label="Lieux"
        :value="currentLocations"
        :items="locations"
        item-text="name"
        item-value="id"
        multiple
        @change="onChange('locations', $event)"
      ></v-autocomplete>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FT } from "~/utils/models/ft";
import { SignaLocation } from "~/utils/models/signaLocation";
import { User } from "~/utils/models/user";
import SearchUser from "~/components/atoms/SearchUser.vue";

export default Vue.extend({
  name: "FTGeneralCard",
  components: { SearchUser },
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    locations(): SignaLocation[] {
      return this.$accessor.signa.locations;
    },
    users(): User[] {
      return this.$accessor.user.users;
    },
    currentLocations(): SignaLocation[] {
      const locations = this.mFT.locations ?? [];
      return locations
        .map((location) => {
          return this.$accessor.signa.getLocationById(location.id);
        })
        .filter(
          (location): location is SignaLocation => location !== undefined
        );
    },
  },
  async mounted() {
    if (this.users.length === 0) {
      this.$accessor.user.fetchUsers();
    }
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
