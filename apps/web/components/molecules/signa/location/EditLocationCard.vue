<template>
  <v-card>
    <v-card-title>Modifier le lieu</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="newLocation.name"
        label="Nom du lieu"
      ></v-text-field>
      <p class="instructions">
        Pour activer et desactiver la modification sur la carte il faut utiliser
        le clic droit.
      </p>
      <LocationMapEditor v-model="newLocation.geoJson" />
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :disabled="disableEditButton" @click="editLocation">
        Modifier le lieu
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SignaLocation } from "@overbookd/signa";
import LocationMapEditor from "./LocationMapEditor.vue";

interface EditLocationCardData {
  newLocation: SignaLocation;
}

export default defineComponent({
  name: "EditLocationCard",
  components: { LocationMapEditor },
  props: {
    location: {
      type: Object as () => SignaLocation,
      required: true,
    },
  },
  emits: ["edition-done"],
  data: (props): EditLocationCardData => ({
    newLocation: { ...props.location },
  }),
  computed: {
    disableEditButton(): boolean {
      return this.location === this.newLocation;
    },
  },
  methods: {
    async editLocation() {
      await this.$accessor.signa.editLocation(this.newLocation);
      this.$emit("edition-done");
    },
  },
});
</script>

<style lang="scss" scoped>
.instructions {
  font-weight: bold;
}
</style>
