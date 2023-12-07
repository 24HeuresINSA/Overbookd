<template>
  <v-card class="signage">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="signage__title">
      <h2>Signalisation</h2>
    </v-card-title>
    <v-card-text>
      <v-file-input
        v-model="signaImage"
        :rules="rules"
        label="Photo de la Signa"
        prepend-icon="mdi-camera"
        accept="image/png, image/jpeg"
        show-size
      />
    </v-card-text>
    <v-card-actions>
      <v-btn text :disabled="invalidImage" @click="uploadSignaImage">
        Enregistrer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { signageTypes } from "@overbookd/signa";
import { imageRules, isImageValid } from "~/utils/rules/file-image.rules";
import Vue from "vue";

export default Vue.extend({
  name: "SignaImageDialog",
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
    signaImage: undefined as File | undefined,
    rules: imageRules,
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
    invalidImage(): boolean {
      return !isImageValid(this.signaImage);
    },
  },
  methods: {
    closeDialog(): void {
      this.$emit("close-dialog");
    },
    async uploadSignaImage() {
      if (!this.me || !this.signaImage) {
        return;
      }
      const signaImageForm = new FormData();
      signaImageForm.append("file", this.signaImage, this.signaImage.name);
      this.$accessor.catalogSignage.uploadSignageImage({
        signageId: this.signage.id,
        signageImage: signaImageForm,
      });
      this.closeDialog();
    },
  },
});
</script>
