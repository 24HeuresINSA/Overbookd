<template>
  <div>
    <v-data-table :headers="headers" :items="publishAnimations">
      <template #[`item.fa_id`]="{ item }">
        <nuxt-link :to="`/fa/${item.fa_id}`"> {{ item.fa_id }}</nuxt-link>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Header } from "~/utils/models/Data";
import { FaSitePublishAnimation } from "~/utils/models/FA";

interface Comcom {
  headers: Header[];
}

export default {
  name: "Comcom",
  data(): Comcom {
    return {
      headers: [
        { text: "FA", value: "fa_id" },
        { text: "Lien de la photo", value: "photo_link" },
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
};
</script>

<style scoped></style>
