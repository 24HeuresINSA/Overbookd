<template>
  <div>
    <v-data-table :headers="headers" :items="publishAnimations">
      <template #[`item.faId`]="{ item }">
        <nuxt-link :to="`/fa/${item.faId}`"> {{ item.faId }}</nuxt-link>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/Data";
import { FaSitePublishAnimation } from "~/utils/models/FA";

interface Comcom {
  headers: Header[];
}

export default Vue.extend({
  name: "Comcom",
  data(): Comcom {
    return {
      headers: [
        { text: "FA", value: "faId" },
        { text: "Lien de la photo", value: "photoLink" },
        { text: "Description", value: "description" },
        { text: "Categories", value: "categories" },
      ],
    };
  },
  computed: {
    publishAnimations(): FaSitePublishAnimation[] {
      return this.$accessor.FA.publishAnimations;
    },
  },
  async beforeMount() {
    this.$accessor.FA.fetchAllPublishAnimations();
  },
});
</script>

<style scoped></style>
