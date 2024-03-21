<template>
  <div class="page-content">
    <h1>Fiches emprunts</h1>
    <v-data-table :headers="headers" :items="borrowItems"></v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BorrowSheet",
  data() {
    return {
      headers: [
        { text: "Name", value: "name" },
        { text: "Available Date", value: "availableDate" },
        { text: "Return Date", value: "returnDate" },
      ],
      borrowItems: [],
    };
  },
});
</script>

<style lang="scss">
.page-content {
  margin-left: 20px;
}
</style>
