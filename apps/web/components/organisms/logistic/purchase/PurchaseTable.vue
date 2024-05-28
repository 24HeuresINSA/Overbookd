<template>
  <v-data-table
    :headers="headers"
    :items="purchases"
    class="purchase-list"
    @click:row="openPurchase"
    @auxclick:row="openPurchaseInNewTab"
  >
    <template #item.availableOn="{ item }">
      {{ formatDateToHumanReadable(item.availableOn) }}
    </template>
    <template #item.remove="{ item }">
      <v-btn icon @click.stop="removePurchase(item)">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </template>
    <template #no-data> Aucune fiche achat </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Header } from "~/utils/data-table/header";
import { formatDateToHumanReadable } from "~/utils/date/date.utils";
import { Purchase } from "@overbookd/logistic";

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
    purchases(): Purchase[] {
      return this.$accessor.purchase.all;
    },
  },
  async mounted() {
    await this.$accessor.purchase.fetchAll();
  },
  methods: {
    formatDateToHumanReadable,
    openPurchase(purchase: Purchase, _: unknown, event: PointerEvent) {
      if (event.ctrlKey) {
        return this.openPurchaseInNewTab(event, { item: purchase });
      }
      this.$router.push({ path: `/logistic/purchase/${purchase.id}` });
    },
    openPurchaseInNewTab(event: PointerEvent, { item }: { item: Purchase }) {
      const purchaseRoute = this.$router.resolve({
        path: `/logistic/purchase/${item.id}`,
      });
      window.open(purchaseRoute.href, "_blank");
    },
    removePurchase(purchase: Purchase) {
      this.$emit("remove:purchase", purchase.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.purchase-list {
  cursor: pointer;
}
</style>
