<template>
  <v-card class="signage">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
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
  },
  watch: {
    signage() {
      this.getImage();
    },
  },
  mounted() {
    this.getImage();
  },
  methods: {
    async getImage() {
      this.imageBlob = await this.$accessor.catalogSignage.getSignageImage(
        this.signage,
      );
    },
    closeDialog(): void {
      this.$emit("close-dialog");
    },
  },
});
</script>
