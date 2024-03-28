<template>
  <div class="purchases-page">
    <h1>Fiches achats</h1>
    <PurchaseTable />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PurchaseTable from "~/components/organisms/logistic/purchase/PurchaseTable.vue";

export default defineComponent({
  name: "Purchases",
  components: { PurchaseTable },
});
</script>
