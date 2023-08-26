<template>
  <div>
    <h1>Catalogue Signa</h1>
    <div class="catalog"></div>
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

export default Vue.extend({
  name: "CatalogSigna",
  components: {
    SnackNotificationContainer,
  },
  head: () => ({
    title: "Catalogue Signa",
  }),
  computed: {
    isCatalogWriter(): boolean {
      return this.$accessor.user.can("write-catalog-signa");
    },
  },
});
</script>
