<template>
  <div>
    <v-card>
      <v-card-title>FT associées</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="childFTs" :items-per-page="5">
          <template #[`item.id`]="{ item }">
            <v-chip color="grey" small>{{ item.id }}</v-chip>
          </template>
          <template #[`item.status`]="{ item }">
            <v-chip color="grey" small>{{ item.status }}</v-chip>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { FT } from "~/utils/models/ft";

export default Vue.extend({
  name: "ChildFTCard",
  data: () => ({
    headers: [
      { text: "Numéro", value: "id" },
      { text: "Nom", value: "name" },
      { text: "Statut", value: "status" },
    ],
  }),
  computed: {
    childFTs(): FT[] {
      return this.$accessor.FA.mFA.fts ?? [];
    },
  },
});
</script>
