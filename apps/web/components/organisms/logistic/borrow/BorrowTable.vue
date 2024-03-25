<template>
  <v-data-table
    :headers="headers"
    :items="borrows"
    class="borrow-list"
    @click:row="openBorrow"
    @auxclick:row="openBorrowInNewTab"
  >
    <template #item.availableOn="{ item }">
      {{ formatDateToHumanReadable(item.availableOn) }}
    </template>
    <template #item.unavailableOn="{ item }">
      {{ formatDateToHumanReadable(item.unavailableOn) }}
    </template>
    <template #item.remove="{ item }">
      <v-btn icon @click.stop="removeBorrow(item)">
        <v-icon>mdi-trash-can</v-icon>
      </v-btn>
    </template>
    <template #no-data> Aucune fiche emprunt </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Borrow } from "@overbookd/logistic";
import { formatDateToHumanReadable } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";

type BorrowTableData = {
  headers: Header[];
};

export default defineComponent({
  name: "BorrowTable",
  emits: ["remove:borrow"],
  data: (): BorrowTableData => ({
    headers: [
      { text: "Nom", value: "lender" },
      { text: "Date de disponibilité", value: "availableOn" },
      { text: "Date de retour", value: "unavailableOn" },
      { text: "Supprimer", value: "remove", sortable: false, align: "center" },
    ],
  }),
  computed: {
    borrows(): Borrow[] {
      return this.$accessor.borrow.all;
    },
  },
  async mounted() {
    await this.$accessor.borrow.fetchAll();
  },
  methods: {
    formatDateToHumanReadable,
    openBorrow(borrow: Borrow, _: unknown, event: PointerEvent) {
      if (event.ctrlKey) {
        return this.openBorrowInNewTab(event, { item: borrow });
      }
      this.$router.push({ path: `/logistic/borrow/${borrow.id}` });
    },
    openBorrowInNewTab(_: Event, { item: borrow }: { item: Borrow }) {
      const borrowRoute = this.$router.resolve({
        path: `/logistic/borrow/${borrow.id}`,
      });
      window.open(borrowRoute.href, "_blank");
    },
    removeBorrow(borrow: Borrow) {
      this.$emit("remove:borrow", borrow.id);
    },
  },
});
</script>
