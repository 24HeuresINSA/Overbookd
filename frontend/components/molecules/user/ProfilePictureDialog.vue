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
        <v-btn text @click="uploadProfilePicture()">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "ProfilePictureDialog",
  data: () => ({
    profilePicture: undefined as File | undefined,
    rules: [
      (value: File) => {
        if (!value) {
          return "Une photo vide c'est pas une photo";
        }
        if (value.size > 1024 * 1024 * 2) {
          return "Moins de 2 Mb stp ça coûte cher le stockage.";
        }
        if (
          value.type != "image/png" &&
          value.type != "image/jpeg" &&
          value.type != "image/gif"
        ) {
          return "Seulement des images (png, jpeg ou gif)";
        }
        return true;
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
        this.profilePicture.name
      );
      await this.$accessor.user.addProfilePicture(profilePictureForm);
      const token = this.$auth.strategy.token.get();
      if (!token) return;
      await this.$accessor.user.getProfilePicture({
        token,
        userId: this.me.id,
      });
      this.$store.dispatch("dialog/closeDialog");
    },
  },
});
</script>
