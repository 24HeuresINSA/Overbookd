<template>
  <div>
    <v-card class="fa">
      <v-card-title>FT associées</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="childFTs"
          :items-per-page="-1"
          :hide-default-footer="true"
        >
          <template #[`item.id`]="{ item }">
            <v-chip small>{{ item.id }}</v-chip>
          </template>
          <template #[`item.name`]="{ item }">
            <nuxt-link :to="`/ft/${item.id}`" class="no-decoration">
              {{ item.name }}
            </nuxt-link>
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
        <v-btn text @click="openNewFTDialog" @close-dialog="closeNewFTDialog">
          Créer une FT
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="isNewFTDialogOpen" width="600">
      <NewFtCard :fa-id="mFA.id" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { FestivalTask } from "@overbookd/festival-event";
import Vue from "vue";
import NewFtCard from "~/components/molecules/festival-event/creation/NewFtCard.vue";
import { BROUILLON } from "~/utils/festival-event/festival-event.model";
import { Fa } from "~/utils/models/fa.model";
import {
  FtSimplified,
  FtStatusLabel,
  ftStatusLabels,
} from "~/utils/models/ft.model";

export default Vue.extend({
  name: "ChildFtCard",
  components: { NewFtCard },
  data: () => ({
    headers: [
      { text: "Numéro", value: "id" },
      { text: "Nom", value: "name" },
      { text: "Statut", value: "status" },
    ],
    isNewFTDialogOpen: false,
  }),
  computed: {
    mFA(): Fa {
      return this.$accessor.fa.mFA;
    },
    childFTs(): FtSimplified[] {
      return this.mFA.fts;
    },
  },
  methods: {
    getFTStatus(status: FestivalTask["status"]): string {
      return status.toLowerCase();
    },
    getStatusLabel(status: FestivalTask["status"]): FtStatusLabel {
      return ftStatusLabels.get(status) ?? BROUILLON;
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

<style lang="scss" scoped>
.no-decoration {
  text-decoration: none;
}
</style>
