<template>
  <v-card class="signage">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="signage__title">
      <h2>Signalisation</h2>
    </v-card-title>
    <v-img :src="signage.imageBlob" :alt="signage.name" contain></v-img>
  </v-card>
</template>

<script lang="ts">
import { signageTypes } from "@overbookd/signa";
import Vue from "vue";

export default Vue.extend({
  name: "DisplayImageSigna",
  props: {
    signage: {
      type: Object,
      default: () => ({
        name: "",
        type: signageTypes.AFFICHE,
      }),
    },
  },
  computed: {
    type() {
      return this.$accessor.dialog.type;
    },
    open() {
      return this.$accessor.dialog.open;
    },
    me() {
      return this.$accessor.user.me;
    },
  },
  methods: {
    closeDialog(): void {
      this.$emit("close-dialog");
    },
  },
});
</script>
