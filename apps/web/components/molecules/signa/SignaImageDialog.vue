<template>
  <v-dialog v-model="toggled" max-width="600">
    <v-card>
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
        <v-btn text @click="uploadsignaImage()">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

const MAX_SIZE = 1024 * 1024 * 2;

export default Vue.extend({
  name: "signaImageDialog",
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
    toggled: {
      get: function (): boolean | unknown {
        if (this.type == "signaImage") {
          return this.open;
        }
        if (!this.open) {
          return false;
        }
        return false;
      },
      set(val): void {
        if (!val) {
          this.$store.dispatch("dialog/closeDialog");
        }
      },
    },
  },
  methods: {
    async uploadsignaImage() {
      if (!this.me || !this.signaImage) {
        return;
      }
      const signaImageForm = new FormData();
      signaImageForm.append(
        "file",
        this.signaImage,
        this.signaImage.name,
      );
      await this.$accessor.catalogSignage.uploadSignageImage(signaImageForm);
      this.$store.dispatch("dialog/closeDialog");
    },
  },
});
</script>
