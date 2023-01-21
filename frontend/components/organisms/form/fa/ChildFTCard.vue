<template>
  <div>
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
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          :disabled="!isFAValidated"
          text
          @click="openNewFTDialog"
          @close-dialog="closeNewFTDialog"
          >Créer une nouvelle FT</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="isNewFTDialogOpen" width="600">
      <NewFTCard />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import NewFTCard from "~/components/molecules/NewFTCard.vue";
import { FA, Status } from "~/utils/models/FA";
import { FT, FTStatus, FTStatusLabel } from "~/utils/models/ft";

export default Vue.extend({
  name: "ChildFTCard",
  components: { NewFTCard },
  data: () => ({
    headers: [
      { text: "Numéro", value: "id" },
      { text: "Nom", value: "name" },
      { text: "Statut", value: "status" },
    ],
    isNewFTDialogOpen: false,
  }),
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    childFTs(): FT[] {
      return this.mFA.fts ?? [];
    },
    isFAValidated(): boolean {
      return this.mFA.status === Status.VALIDATED;
    },
  },
  methods: {
    getFTStatus(status: FTStatus): string {
      return status.toLowerCase();
    },
    getStatusLabel(status: FTStatus): FTStatusLabel {
      return FTStatusLabel[status];
    },
    openNewFTDialog() {
      this.isNewFTDialogOpen = true;
    },
    closeNewFTDialog() {
      this.isNewFTDialogOpen = false;
    },
  },
});
</script>
