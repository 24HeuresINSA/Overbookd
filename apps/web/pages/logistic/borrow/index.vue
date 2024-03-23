<template>
  <div class="borrows-page">
    <h1>Fiches emprunts</h1>
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
      <template #no-data> Aucune fiche emprunts </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Borrow } from "@overbookd/logistic";
import { formatDateToHumanReadable } from "~/utils/date/date.utils";

export default defineComponent({
  name: "Borrows",
  data() {
    return {
      headers: [
        { text: "Nom", value: "lender" },
        { text: "Date de disponibilité", value: "availableOn" },
        { text: "Date de retour", value: "unavailableOn" },
      ],
    };
  },
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
  },
});
</script>

<style lang="scss">
.borrow-list {
  cursor: pointer;
}
</style>
