<template>
  <div>
    <h1>{{ selectedBorrow?.lender }}</h1>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { Borrow } from "@overbookd/logistic";
import { defineComponent } from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default defineComponent({
  name: "BorrowSheetDetails",
  components: { SnackNotificationContainer },
  computed: {
    selectedBorrow(): Borrow | null {
      return this.$accessor.borrow.selected;
    },
    borrowId(): number {
      return +this.$route.params.borrowId;
    },
  },
  async mounted() {
    await this.$accessor.borrow.fetchOne(this.borrowId);
    if (!this.selectedBorrow) {
      this.$router.push({ path: "/logistic/borrow" });
    }
  },
});
</script>
