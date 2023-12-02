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
      <v-btn text @click="uploadSignaImage()">Enregistrer </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { signageTypes } from "@overbookd/signa";
import Vue from "vue";

const MAX_SIZE = 1024 * 1024 * 2;

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
    rules: [
      (value?: File) => !!value || "Une photo vide c'est pas une photo",
      (value?: File) => (value?.size ?? 0) < MAX_SIZE || "Moins de 2 Mb stp 🙏",
      (value?: File) => {
        const extensions = ["image/png", "image/jpeg", "image/gif"];
        const isSupportedFile = !!value && extensions.includes(value.type);
        return isSupportedFile || "Seulement des images (png, jpeg ou gif)";
      },
    ],
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
