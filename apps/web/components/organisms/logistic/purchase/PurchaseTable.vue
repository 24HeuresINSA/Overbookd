<template>
  <v-data-table :headers="headers" :items="purchases" class="purchase-list">
    <template #no-data> Aucune fiche achat </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Header } from "~/utils/models/data-table.model";

type PurchaseTableData = {
  headers: Header[];
};

export default defineComponent({
  name: "PurchaseTable",
  data: (): PurchaseTableData => ({
    headers: [
      { text: "Nom", value: "seller" },
      { text: "Date de disponibilité", value: "availableOn" },
      { text: "Supprimer", value: "remove", sortable: false, align: "center" },
    ],
  }),
  computed: {
    purchases() {
      return [];
    },
  },
});
</script>

<style lang="scss" scoped>
.purchase-list {
  cursor: pointer;
}
</style>
