<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="500px"
      @keydown.esc="closeDialog()"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Ajouter un lieu</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="fields.name"
              :rules="[(v) => !!v || 'Location is required']"
              label="Localisation"
              required
            ></v-text-field>
            <v-select
              v-model="fields.neededBy"
              :items="neededByList"
              :rules="[
                (v) => v.length > 0 || 'Au moins 1 doit être selectionné',
              ]"
              label="Pour qui ?"
              multiple
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-spacer></v-spacer>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeDialog()">Annuler</v-btn>
          <v-btn :disabled="!valid" color="blue darken-1" @click="onSubmit()"
            >Sauvegarder</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      {{ snack.feedbackMessage }}
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { location } from "~/utils/models/repo";
import { Snack } from "~/utils/models/snack";

// All Data ts types definitions
declare interface Data {
  fields: Omit<location, "_id">;
  dialog: boolean;
  neededByList: Array<string>;
  valid: boolean;
  snack: Snack;
}

export default Vue.extend({
  name: "LocationAdder",
  data(): Data {
    return {
      dialog: false,
      fields: {
        name: "",
        neededBy: [] as Array<string>,
      },
      neededByList: ["SIGNA", "INVENTAIRE"],
      valid: false,
      snack: new Snack(),
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      const form = this.$refs.form as HTMLFormElement;
      form.reset();
      this.dialog = false;
    },
    async onSubmit() {
      const res = await this.$accessor.location.createNewLocation(this.fields);
      if (res) {
        this.closeDialog();
      } else {
        this.snack.display("Erreur serveur, réessaye");
      }
    },
  },
});
</script>

<style></style>
