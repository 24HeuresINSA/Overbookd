<template>
  <div>
    <v-card>
      <v-card-title>FA associée</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="[mFT.fa]"
          :hide-default-footer="true"
        >
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!mFT.fa" text @click="unlinkFA">Détacher la FA</v-btn>
        <v-btn :disabled="mFT.fa" text @click="openFAChooser"
          >Choisir une FA parente</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="isFASelectDialogOpen" max-width="500px">
      <FAChooser
        @close-dialog="closeFAChooser"
        @change="updateParentFA"
      ></FAChooser>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FAChooser from "~/components/molecules/FAChooser.vue";
import { FA } from "~/utils/models/FA";
import { FT } from "~/utils/models/ft";

export default Vue.extend({
  name: "ParentFACard",
  components: {
    FAChooser,
  },
  data: () => ({
    headers: [
      { text: "Numéro", value: "id" },
      { text: "Nom", value: "name" },
      { text: "Equipe", value: "Team" },
      { text: "Resp", value: "user_in_charge" },
    ],
    parentFA: {} as FA,
    isFASelectDialogOpen: false,
  }),
  computed: {
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
  },
  methods: {
    updateParentFA(fa: FA) {
      const updatedFT = { ...this.mFT, fa };
      this.$accessor.FT.setFT(updatedFT);
      this.closeFAChooser();
    },
    unlinkFA() {
      const updatedFT = { ...this.mFT, fa: undefined };
      this.$accessor.FT.setFT(updatedFT);
    },
    openFAChooser() {
      this.isFASelectDialogOpen = true;
    },
    closeFAChooser() {
      this.isFASelectDialogOpen = false;
    },
  },
});
</script>
