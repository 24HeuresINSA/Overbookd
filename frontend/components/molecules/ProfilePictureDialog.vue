<template>
  <v-dialog v-model="toggled" max-width="600">
    <v-card>
      <v-card-text>
        <v-file-input v-model="PP"> </v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="uploadPP()">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";

export default Vue.extend({
  name: "ProfilePictureDialog",
  data() {
    return {
      PP: undefined as undefined | File,
    };
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
    toggled: {
      get: function (): boolean | unknown {
        if (this.type == "pp") {
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
    uploadPP: async function () {
      if (this.me && this.PP) {
        let form = new FormData();
        form.append("files", this.PP, this.PP.name);
        form.append("id", this.me.id);
        const res = await safeCall(
          this.$store,
          RepoFactory.userRepo.addPP(this, form)
        );
        if (res) {
          this.$accessor.notif.pushNotification({
            message: "Photo ajoutée, rafraîchis la page pour la voir.",
          });
          this.$accessor.dialog.closeDialog();
        }
      }
    },
  },
});
</script>
