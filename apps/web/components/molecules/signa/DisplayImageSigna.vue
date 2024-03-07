<template>
  <v-card class="signage">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <img :src="image" alt="image" />
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
    image() {
      return this.$accessor.catalogSignage.signage?.imageBlob;
    },
  },
  watch: {
    signage() {
      this.fetchImage();
    },
  },
  methods: {
    async fetchImage() {
      this.$accessor.catalogSignage.fetchSignageImage(this.signage);
    },
    closeDialog(): void {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss">
.signage {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  img {
    max-width: 100%;
    max-height: 100%;
  }
  .close-btn {
    position: absolute;
    top: 0px;
    right: 0px;
  }
}
</style>
