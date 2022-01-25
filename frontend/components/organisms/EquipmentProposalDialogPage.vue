<template>
  <div>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="80%"
      @keydown.esc="dialog = false"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Proposition d'équipements</span>
        </v-card-title>
        <v-card-text>
          <EquipmentProposalTable></EquipmentProposalTable>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="closeDialog">Annuler</v-btn>
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
import { Snack } from "../../utils/models/snack";
import EquipmentProposalTable from "~/components/organisms/EquipmentProposalTable.vue";
// All Data ts types definitions
declare interface Data {
  dialog: boolean;
  snack: Snack;
}

export default Vue.extend({
  name: "EquipmentProposalDialogPage",
  components: {
    EquipmentProposalTable,
  },
  data(): Data {
    return {
      dialog: false,
      snack: new Snack(),
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
  },
});
</script>

<style></style>
