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
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Header } from "~/utils/models/Data";
import { fa_site_publish_animation } from "~/utils/models/FA";

interface comcom {
  headers: Header[];
  publishAnimations: fa_site_publish_animation[];
}

export default {
  name: "Comcom",
  data(): comcom {
    return {
      headers: [
        { text: "FA", value: "fa_id" },
        { text: "Lien de la photo", value: "photo_link" },
        { text: "Description", value: "description" },
        { text: "Categories", value: "categories" },
      ],
      publishAnimations: [],
    };
  },
  async beforeMount() {
    this.getAllPublishAnimations();
  },
  methods: {
    async getAllPublishAnimations() {
      const publishAnimations = await safeCall(
        this.$store,
        RepoFactory.faRepo.getAllPublishAnimation(this),
        {
          errorMessage: "Probleme lors de la récuperation des animations",
        }
      );
      if (publishAnimations) {
        this.publishAnimations = publishAnimations.data;
      }
    },
  },
};
</script>

<style scoped></style>
