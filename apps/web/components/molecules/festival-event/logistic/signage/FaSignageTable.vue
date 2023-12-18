<template>
  <div class="signages__listing">
    <v-data-table
      :headers="headers"
      :items="signages"
      item-key="key"
      :items-per-page="-1"
      disable-pagination
      hide-default-footer
    >
      <template #item.catalogItem="{ item }">
        <SearchSignage
          :signage="item.catalogItem"
          :type="item.type"
          :boxed="false"
          :disabled="cantLinkCatalogItem"
          dense
          label=""
          @change="linkCatalogItem($event, item)"
        />
      </template>

      <template #item.actions="{ item }">
        <div v-if="!disabled">
          <v-btn icon @click="updateSignage(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="removeSignage(item)">
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </div>
      </template>
      <template #no-data> Aucune demande de signalétique </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchSignage from "~/components/atoms/field/search/SearchSignage.vue";
import {
  Signage as FaSignage,
  signa,
  FestivalActivity,
  isDraft,
  APPROVED,
} from "@overbookd/festival-activity";
import { Signage as CatalogSignage } from "@overbookd/signa";
import { Header } from "~/utils/models/data-table.model";

type FaSignageTableData = {
  headers: Header[];
  isSignageDialogOpen: boolean;
  selectedSignage: FaSignage | null;
};

export default defineComponent({
  name: "FaSignageTable",
  components: { SearchSignage },
  props: {
    signages: {
      type: Array as () => FaSignage[],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: (): FaSignageTableData => ({
    headers: [
      { text: "Quantité", value: "quantity" },
      { text: "Type", value: "type" },
      { text: "Texte à écrire", value: "text", sortable: false },
      { text: "Taille", value: "size", sortable: false },
      { text: "Commentaire", value: "comment", sortable: false },
      { text: "Référence", value: "catalogItem", sortable: false },
      { text: "Actions", value: "actions", sortable: false },
    ],

    isSignageDialogOpen: false,
    selectedSignage: null,
  }),
  computed: {
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    cantLinkCatalogItem(): boolean {
      if (isDraft(this.mFA)) return true;
      const isSignaMember = this.$accessor.user.isMemberOf(signa);
      const isValidated = this.mFA.reviews.signa === APPROVED;
      return !isSignaMember || isValidated;
    },
  },
  methods: {
    updateSignage(signage: FaSignage) {
      this.$emit("update", signage);
    },
    removeSignage(signage: FaSignage) {
      this.$emit("remove", signage);
    },
    linkCatalogItem(catalogSignage: CatalogSignage, faSignage: FaSignage) {
      this.$accessor.festivalActivity.linkSignageCatalogItem({
        signageId: faSignage.id,
        catalogItem: catalogSignage,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.signages {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
}
</style>
