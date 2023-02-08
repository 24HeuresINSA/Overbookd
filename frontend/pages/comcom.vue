<template>
  <div>
    <v-data-table :headers="headers" :items="publishAnimations">
      <template #item.faId="{ item }">
        <v-chip-group>
          <v-chip small>{{ item.fa.id }}</v-chip>
        </v-chip-group>
      </template>
      <template #item.name="{ item }">
        <nuxt-link :to="`/fa/${item.fa.name}`">
          {{ item.fa.name }}
        </nuxt-link>
      </template>
      <template #item.photoLink="{ item }">
        <v-btn icon :href="item.photoLink" target="_blank">
          <v-icon large>mdi-camera</v-icon>
        </v-btn>
      </template>
      <template #item.categories="{ item }">
        <v-chip-group column>
          <v-chip v-for="category in item.categories" :key="category">
            {{ category }}
          </v-chip>
        </v-chip-group>
      </template>
      <template #item.isMajor="{ item }">
        <v-icon v-if="item.isMajor" color="green" large>
          mdi-check-circle
        </v-icon>
        <v-icon v-else color="red" large>mdi-close-circle</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/Data";
import { SitePublishAnimationWithFa } from "~/utils/models/FA";

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
        { text: "Lien de la photo", value: "photoLink", align: "center" },
        { text: "Description", value: "description" },
        { text: "Categories", value: "categories" },
        { text: "Anim phare", value: "isMajor", align: "center" },
      ],
    };
  },
  computed: {
    publishAnimations(): SitePublishAnimationWithFa[] {
      return this.$accessor.publishAnimation.publishAnimations;
    },
  },
  async beforeMount() {
    this.$accessor.publishAnimation.fetchAllPublishAnimations();
  },
});
</script>
