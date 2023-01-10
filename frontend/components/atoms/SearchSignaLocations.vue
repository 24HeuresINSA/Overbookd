<template>
  <v-autocomplete
    :value="selectedLocations"
    :items="locations"
    :loading="loading"
    chips
    multiple
    item-value="id"
    item-text="name"
    :label="label"
    :solo="boxed"
    :filled="boxed"
    return-object
    @change="propagateEvent"
  >
    <template #no-data>
      <v-list-item> Aucune localisation correspondante </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from "vue";
import { SignaLocation } from "~/utils/models/signaLocation";

interface SearchLocationData {
  loading: boolean;
}

export default Vue.extend({
  name: "SearchSignaLocations",
  model: {
    prop: "selectedLocations",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher un lieu",
    },
    selectedLocations: {
      type: Array,
      default: () => [] as SignaLocation[],
    },
    boxed: {
      type: Boolean,
      default: true,
    },
  },
  data(): SearchLocationData {
    return {
      loading: false,
    };
  },
  computed: {
    locations() {
      return this.$accessor.signa.locations;
    },
  },
  mounted() {
    if (this.locations.length) return;
    this.$accessor.signa.getAllSignaLocations();
  },
  methods: {
    propagateEvent(locations: SignaLocation[]) {
      this.$emit("change", locations);
    },
  },
});
</script>
