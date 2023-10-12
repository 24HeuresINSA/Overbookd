<template>
  <v-card>
    <v-card-title>Ajouter un nouveau lieu</v-card-title>
    <v-card-text>
      <v-text-field v-model="locationName" label="Nom du lieu"></v-text-field>
      <LocationMapEditor v-model="selection"/>
    </v-card-text>
    <v-card-actions>
      <v-btn :disabled="!locationName" @click="createNewLocation">
        Ajouter le lieu
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import LocationMapEditor from "./LocationMapEditor.vue";
import { MapObjectType } from "~/utils/models/signa-location.model";
import { CreateLocation } from "~/utils/models/signa-location.model";

export default Vue.extend({
  name: "NewLocationCard",
  components: { LocationMapEditor },
  data: () => ({
    locationName: "",
    selection: null as null | MapObjectType,
  }),
  methods: {
    async createNewLocation() {
      if (!this.locationName) return;
      const blankLocation: CreateLocation = { name: this.locationName, coordinates: this.selection };
      await this.$accessor.signa.createLocation(blankLocation);

      this.locationName = "";
      this.$emit("close-dialog");
    },
  },
});
</script>
