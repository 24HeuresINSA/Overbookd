<template>
  <div>
    <v-card class="fa">
      <v-card-title>FT associées</v-card-title>
      <v-card-text>
        <v-data-table :headers="headers" :items="childFTs" :items-per-page="5">
          <template #[`item.id`]="{ item }">
            <v-chip small>{{ item.id }}</v-chip>
          </template>
          <template #[`item.name`]="{ item }">
            <a :href="`/ft/${item.id}`" class="no-decoration">
              {{ item.name }}
            </a>
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
      <v-card-actions v-if="isFAValidated">
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="openAddingFTDialog"
          @close-dialog="closeAddingFTDialog"
          >Ajouter une FT existante</v-btn
        >
        <v-btn text @click="openNewFTDialog" @close-dialog="closeNewFTDialog"
          >Créer une FT</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="isAddingFTDialogOpen" width="600">
      <v-card>
        <v-card-title>Lier une FT existante</v-card-title>
        <v-card-text>
          <SearchFT
            v-model="selectedFT"
            label="FT associée"
            :boxed="false"
          ></SearchFT>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn :disabled="!selectedFT" @click="updateChildFT"
            >Lier la FT</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="isNewFTDialogOpen" width="600">
      <NewFTCard />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SearchFT from "~/components/atoms/SearchFT.vue";
import NewFTCard from "~/components/molecules/NewFTCard.vue";
import { FA, Status } from "~/utils/models/FA";
import { FT, FTStatus, FTStatusLabel } from "~/utils/models/ft";

export default Vue.extend({
  name: "ChildFTCard",
  components: { NewFTCard, SearchFT },
  data: () => ({
    headers: [
      { text: "Numéro", value: "id" },
      { text: "Nom", value: "name" },
      { text: "Statut", value: "status" },
    ],
    isAddingFTDialogOpen: false,
    isNewFTDialogOpen: false,
    selectedFT: null as FT | null,
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
    openAddingFTDialog() {
      this.isAddingFTDialogOpen = true;
    },
    closeAddingFTDialog() {
      this.isAddingFTDialogOpen = false;
    },
    openNewFTDialog() {
      this.isNewFTDialogOpen = true;
    },
    closeNewFTDialog() {
      this.isNewFTDialogOpen = false;
    },
    async updateChildFT(ft: FT) {
      await this.$accessor.FT.fetchFT(ft.id);
      if (!this.$accessor.FT.mFT) return;

      const updatedFT = { ...this.$accessor.FT.mFT, fa: this.mFA ?? undefined };
      this.$accessor.FT.updateFT(updatedFT);
      this.$accessor.FT.resetFT();
      this.$accessor.FA.getAndSet(this.mFA.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.no-decoration {
  text-decoration: none;
}
</style>
