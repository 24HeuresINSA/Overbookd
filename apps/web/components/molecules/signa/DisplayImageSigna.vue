<template>
  <v-card class="signage">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="signage__title">
      <h2>Signalisation</h2>
    </v-card-title>
    <v-img :src="imageBlob" :alt="signage.name" contain></v-img>
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
  data: () => ({
    imageBlob: undefined as string | undefined,
  }),
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
  beforeMount() {
  this.getImage();
  },
  methods: {
    async getImage() {
    this.imageBlob = await this.$accessor.catalogSignage.getSignageImage(this.signage);
    console.log(this.imageBlob);
    },
    closeDialog(): void {
      this.$emit("close-dialog");
    },
  },

});
</script>
