<template>
  <div>
    <v-dialog v-model="isFASelectDialogOpen" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
        </v-card-title>
        <v-form v-model="validSelectFA">
          <v-card-text>
            <v-autocomplete
              v-model="selectedFACount"
              label="FA"
              clearable
              autofocus
              auto-select-first
              required
              :rules="FArules"
              :items="FAs"
              :item-value="(fa) => fa.count"
              :item-text="(fa) => fa.general.name"
            ></v-autocomplete>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="isFASelectDialogOpen = false">
              Annuler
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              :disabled="!validSelectFA"
              @click="validate"
            >
              Valider
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { FA } from "~/utils/models/FA";
export default Vue.extend({
  name: "FAChooser",
  data() {
    return {
      dialogTitle: "Choix d'une FA parente pour la FT actuelle",

      /* ################### Dialogs ################## */
      // Select FA dialog state
      isFASelectDialogOpen: false,
      // Select FA form state
      validSelectFA: false,
      // FA which is selected
      selectedFACount: undefined as undefined | Number,
      // Rules for FA selection validation
      FArules: [(v: any) => !!v || "Choisis une FA"],
    };
  },
  computed: {
    FAs(): FA[] {
      return [];
    },
  },
  watch: {
    isFASelectDialogOpen: function (state) {
      // If dialog is closed
      if (!state) {
        // Reset related content
        this.validSelectFA = false;
        this.selectedFACount = undefined;
      }
    },
  },
  async mounted() {
    // Update list of FAs
    await this.$accessor.FA.fetchAll();
  },
  methods: {
    openDialog() {
      this.isFASelectDialogOpen = true;
    },
    closeDialog() {
      this.isFASelectDialogOpen = false;
    },
    async validate() {
      await this.$accessor.FT.setParentFA(this.selectedFACount);
      this.closeDialog();
    },
  },
});
</script>

<style></style>
