<template>
  <div class="purchases-page">
    <h1>Fiches achats</h1>
    <PurchaseTable @remove:purchase="removePurchase" />

    <v-btn
      color="secondary"
      class="btn-plus"
      elevation="2"
      fab
      @click="openNewPurchaseDialog"
    >
      <v-icon>mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="isNewPurchaseDialogOpen" max-width="500">
      <InitPurchaseCard @init="initPurchase" />
    </v-dialog>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PurchaseTable from "~/components/organisms/logistic/purchase/PurchaseTable.vue";
import InitPurchaseCard from "~/components/organisms/logistic/purchase/InitPurchaseCard.vue";
import { Purchase, InitPurchaseForm } from "@overbookd/logistic";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

type PurchasesData = {
  isNewPurchaseDialogOpen: boolean;
};

export default defineComponent({
  name: "Purchases",
  components: { PurchaseTable, InitPurchaseCard, SnackNotificationContainer },
  data: (): PurchasesData => ({
    isNewPurchaseDialogOpen: false,
  }),
  computed: {
    selectedPurchaseId(): Purchase["id"] {
      return this.$accessor.purchase.selected.id;
    },
  },
  methods: {
    async initPurchase(form: InitPurchaseForm) {
      await this.$accessor.purchase.init(form);
      this.closeNewPurchaseDialog();
      if (!this.selectedPurchaseId) return;
      this.$router.push({
        path: `/logistic/purchase/${this.selectedPurchaseId}`,
      });
    },
    async removePurchase(purchaseId: Purchase["id"]) {
      await this.$accessor.purchase.remove(purchaseId);
    },
    closeNewPurchaseDialog() {
      this.isNewPurchaseDialogOpen = false;
    },
    openNewPurchaseDialog() {
      this.isNewPurchaseDialogOpen = true;
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
