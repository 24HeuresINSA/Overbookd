<template>
  <div>
    <v-card>
      <v-card-title>FT associées</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="FTs">
          <template #[`item.status`]="row">
            <v-chip
              small
              :color="
                row.item.isValid ? color[row.item.status] : color['deleted']
              "
            >
              {{ row.item.status }}
            </v-chip>
          </template>
          <template #[`item.action`]="{ item }">
            <v-btn small icon :to="`/ft/${item.count}`">
              <v-icon small>mdi-link</v-icon>
            </v-btn>
          </template>
        </v-data-table>
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
      { text: "Status", value: "status" },
      { text: "Action", value: "action" },
    ],

    newFTDialog: false,
    newFTName: undefined,
    color: {
      undefined: "grey",
      draft: "grey",
      submitted: "orange",
      validated: "green",
      refused: "red",
      ready: "#bf2bbd",
      deleted: "#008080",
    },
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
      this.newFTDialog = false;
    },
  },
};
</script>

<style scoped></style>
