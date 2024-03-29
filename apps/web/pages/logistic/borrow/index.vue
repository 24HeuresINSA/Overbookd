<template>
  <div class="borrows-page">
    <h1>Fiches emprunts</h1>
    <BorrowTable @remove:borrow="removeBorrow" />

    <v-btn
      color="secondary"
      class="btn-plus"
      elevation="2"
      fab
      @click="openNewBorrowDialog"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="isNewBorrowDialogOpen" max-width="500">
      <InitBorrowCard @init="initBorrow" />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import BorrowTable from "~/components/organisms/logistic/borrow/BorrowTable.vue";
import InitBorrowCard from "~/components/organisms/logistic/borrow/InitBorrowCard.vue";
import { Borrow, InitBorrowForm } from "@overbookd/logistic";

type BorrowsData = {
  isNewBorrowDialogOpen: boolean;
};

export default defineComponent({
  name: "Borrows",
  components: { BorrowTable, InitBorrowCard },
  data: (): BorrowsData => ({
    isNewBorrowDialogOpen: false,
  }),
  computed: {
    selectedBorrowId(): Borrow["id"] {
      return this.$accessor.borrow.selected.id;
    },
  },
  methods: {
    async initBorrow(form: InitBorrowForm) {
      await this.$accessor.borrow.init(form);
      this.closeNewBorrowDialog();
      if (!this.selectedBorrowId) return;
      this.$router.push({ path: `/logistic/borrow/${this.selectedBorrowId}` });
    },
    async removeBorrow(borrowId: Borrow["id"]) {
      await this.$accessor.borrow.remove(borrowId);
    },
    openNewBorrowDialog() {
      this.isNewBorrowDialogOpen = true;
    },
    closeNewBorrowDialog() {
      this.isNewBorrowDialogOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.btn-plus {
  right: 20px;
  bottom: 45px;
  position: fixed;
  @media screen and (max-width: $mobile-max-width) {
    bottom: 70px;
  }
}
</style>
