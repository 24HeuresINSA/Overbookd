<template>
  <v-card>
    <v-card-title>Général</v-card-title>
    <v-card-text>
      <v-text-field
        :value="mFT.name"
        label="Nom de la FT"
        @change="onChange('name', $event)"
      ></v-text-field>
      <v-autocomplete
        :value="mFT.in_charge"
        label="Responsable"
        :items="users"
        item-value="id"
        item-text="username"
        @change="onChange('in_charge', $event)"
      ></v-autocomplete>
      <v-switch
        :value="mFT.are_static_time_windows"
        label="Créneaux statiques"
        @change="onChange('are_static_time_windows', $event)"
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
import { FT } from "~/utils/models/FT";
import { User } from "~/utils/models/repo";
import { SignaLocation } from "~/utils/models/signaLocation";

export default Vue.extend({
  name: "FTGeneralCard",
  data: () => ({
    users: [] as Partial<User>[],
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    locations(): SignaLocation[] {
      return this.$accessor.signaLocation.signaLocations;
    },
    currentLocations(): SignaLocation[] {
      const locationsId = this.$accessor.FT.mFT.locations ?? [];
      return locationsId
        .map((locationId) => {
          return this.$accessor.signaLocation.getLocationById(locationId);
        })
        .filter((location): location is SignaLocation => location !== undefined);
    },
  },
  async mounted() {
    this.users = this.$accessor.user.usernames;
    if (this.users.length === 0) {
      // fetch usernames
      await this.$accessor.user.getUsername("");
      this.users = this.$accessor.user.usernames;
    }
  },
  methods: {
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FT.updateFT({ key: key, value: value });
    },
  },
});
</script>

<style scoped></style>
