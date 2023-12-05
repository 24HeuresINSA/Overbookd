<template>
  <v-dialog v-model="toggled" max-width="600">
    <v-card>
      <v-card-text>
        <v-file-input
          v-model="profilePicture"
          :rules="rules"
          label="Photo de profil"
          prepend-icon="mdi-camera"
          accept="image/png, image/jpeg"
          show-size
        />
      </v-card-text>
      <v-card-actions>
        <v-btn text :disabled="isImageValid" @click="uploadProfilePicture">
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { imageRules, isImageValid } from "~/utils/rules/file-image.rules";

export default Vue.extend({
  name: "ProfilePictureDialog",
  data: () => ({
    profilePicture: undefined as File | undefined,
    rules: imageRules(),
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
        if (this.type == "profilePicture") {
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
    isImageValid(): boolean {
      return !isImageValid(this.profilePicture);
    },
  },
  methods: {
    async uploadProfilePicture() {
      if (!this.me || !this.profilePicture) {
        return;
      }
      const profilePictureForm = new FormData();
      profilePictureForm.append(
        "file",
        this.profilePicture,
        this.profilePicture.name,
      );
      await this.$accessor.user.addProfilePicture(profilePictureForm);
      this.$accessor.user.setMyProfilePicture();
      this.$store.dispatch("dialog/closeDialog");
    },
  },
});
</script>
