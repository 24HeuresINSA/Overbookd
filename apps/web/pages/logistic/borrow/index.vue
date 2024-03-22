<template>
  <div class="borrows-page">
    <h1>Fiches emprunts</h1>
    <v-data-table :headers="headers" :items="borrowItems"></v-data-table>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Borrows",
  data() {
    return {
      headers: [
        { text: "Nom", value: "name" },
        { text: "Date de disponibilité", value: "availableOn" },
        { text: "Date de retour", value: "unavailableOn" },
      ],
      borrowItems: [],
    };
  },
});
</script>

<style lang="scss">
.borrows-page {
  margin-left: 20px;
}
</style>
