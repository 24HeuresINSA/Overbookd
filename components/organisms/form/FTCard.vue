<template>
  <div>
    <v-card>
      <v-card-title>FT 👻</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="FTs"> </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="newFTDialog = true">ajouter une FT</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="newFTDialog" max-width="600">
      <v-card>
        <v-card-title>Ajouter une FT</v-card-title>
        <v-card-text>
          <v-text-field v-model="newFTName" label="Nom de la FT">
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer> </v-spacer>
          <v-btn text @click="addFT"> ajouter la FT</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { RepoFactory } from "../../../repositories/repoFactory";
import { safeCall } from "../../../utils/api/calls";

export default {
  name: "FTCard",

  data: () => ({
    headers: [
      { text: "FT", value: "general.name" },
      { text: "action", value: "action" },
    ],

    newFTDialog: false,
    newFTName: undefined,
  }),

  computed: {
    FTs: function () {
      return this.$accessor.FA.mFA.FTs;
    },
  },

  methods: {
    addFT: async function () {
      const FTName = this.newFTName;
      await this.$accessor.FA.addNewFT(FTName);
    },
  },
};
</script>

<style scoped></style>
