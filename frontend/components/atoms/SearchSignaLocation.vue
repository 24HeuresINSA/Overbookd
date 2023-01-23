<template>
  <v-autocomplete
    :value="location"
    :items="locations"
    :loading="loading"
    chips
    clearable
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
  name: "SearchSignaLocation",
  model: {
    prop: "location",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher un lieu",
    },
    location: {
      type: Object as () => SignaLocation | null,
      default: () => null,
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
    propagateEvent(location: SignaLocation) {
      this.$emit("change", location);
    },
  },
});
</script>
