<template>
  <div>
    <v-data-table :headers="headers" :items="publishAnimations">
      <template #[`item.faId`]="{ item }">
        <v-chip-group>
          <v-chip small>{{ item.faId }}</v-chip>
        </v-chip-group>
      </template>
      <template #[`item.name`]="{ item }">
        <nuxt-link :to="`/fa/${item.faId}`">
          {{ item.name }}
        </nuxt-link>
      </template>
      <template #[`item.photoLink`]="{ item }">
        <a :href="item.photoLink" target="_blank"> {{ item.photoLink }}</a>
      </template>
      <template #[`item.categories`]="{ item }">
        <v-chip-group column>
          <v-chip v-for="category in item.categories" :key="category">
            {{ category }}
          </v-chip>
        </v-chip-group>
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
        { text: "Id", value: "faId" },
        { text: "Nom", value: "name" },
        { text: "Lien de la photo", value: "photoLink" },
        { text: "Description", value: "description" },
        { text: "Categories", value: "categories" },
        { text: "Anim phare", value: "isMajor" },
      ],
    };
  },
  computed: {
    publishAnimations(): FaSitePublishAnimation[] {
      return this.$accessor.publishAnimation.publishAnimations;
    },
  },
  async beforeMount() {
    this.$accessor.publishAnimation.fetchAllPublishAnimations();
  },
});
</script>
