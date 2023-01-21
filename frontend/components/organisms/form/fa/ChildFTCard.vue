<template>
  <v-card class="fa">
    <v-card-title>FT associées</v-card-title>
    <v-card-text>
      <v-data-table :headers="headers" :items="childFTs" :items-per-page="5">
        <template #[`item.id`]="{ item }">
          <v-chip small>{{ item.id }}</v-chip>
        </template>
        <template #[`item.status`]="{ item }">
          <v-chip-group id="status">
            <v-chip :color="getFTStatus(item.status)" small>
              {{ getStatusLabel(item.status) }}
            </v-chip>
          </v-chip-group>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { FT, FTStatus, FTStatusLabel } from "~/utils/models/ft";

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
  methods: {
    getFTStatus(status: FTStatus): string {
      return status.toLowerCase();
    },
    getStatusLabel(status: FTStatus): FTStatusLabel {
      return FTStatusLabel[status];
    },
  },
});
</script>
