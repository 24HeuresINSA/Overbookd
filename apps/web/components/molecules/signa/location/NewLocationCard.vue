<template>
  <v-card>
    <v-card-title>Ajouter un nouveau lieu</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="newLocation.name"
        label="Nom du lieu"
      ></v-text-field>
      <LocationMapEditor v-model="newLocation.geoJson" />
    </v-card-text>
    <v-card-actions>
      <v-btn :disabled="!isNewLocationDefined" @click="createNewLocation">
        Ajouter le lieu
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Point } from "~/utils/signa-location/point";
import LocationMapEditor from "./LocationMapEditor.vue";
import { CreateLocation } from "~/utils/models/signa-location.model";
import { mapConfiguration } from "~/utils/models/signa-location.model";

type NewLocationCardDate = {
  newLocation: CreateLocation;
};

const defaultLocation: CreateLocation = {
  name: "",
  geoJson: Point.create(mapConfiguration.center),
};

export default defineComponent({
  name: "NewLocationCard",
  components: { LocationMapEditor },
  emits: ["creation-done"],
  data: (): NewLocationCardDate => ({
    newLocation: { ...defaultLocation },
  }),
  computed: {
    isNewLocationDefined(): boolean {
      return this.newLocation.name.length > 0;
    },
  },
  methods: {
    async createNewLocation() {
      if (!this.isNewLocationDefined) return;
      await this.$accessor.signa.createLocation(this.newLocation);

      this.newLocation = { ...defaultLocation };
      this.$emit("creation-done");
    },
  },
});
</script>
