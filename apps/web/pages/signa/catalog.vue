<template>
  <div>
    <h1>Catalogue Signa</h1>
    <div class="catalog">
      <section class="signages">
        <SignageListing />
        <v-btn
          v-if="isCatalogWriter"
          large
          color="success"
          rounded
          @click="openSignageCreationDialog"
        >
          <v-icon dark> mdi-plus </v-icon> Ajouter une signalisation
        </v-btn>
      </section>
    </div>

    <v-dialog v-model="signageCreationDialogOpened" width="600px">
      <SignageForm @close-dialog="closeSignageCreationDialog" />
    </v-dialog>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import SignageListing from "~/components/organisms/logistic/SignageListing.vue";
import SignageForm from "~/components/molecules/logistic/SignageForm.vue";
import { WRITE_SIGNAGE_CATALOG } from "@overbookd/permission";

export default Vue.extend({
  name: "Catalog",
  components: {
    SnackNotificationContainer,
    SignageListing,
    SignageForm,
  },
  data: () => ({
    signageCreationDialogOpened: false,
  }),
  head: () => ({
    title: "Catalogue Signa",
  }),
  computed: {
    isCatalogWriter(): boolean {
      return this.$accessor.user.can(WRITE_SIGNAGE_CATALOG);
    },
  },
  methods: {
    openSignageCreationDialog() {
      this.signageCreationDialogOpened = true;
    },
    closeSignageCreationDialog() {
      this.signageCreationDialogOpened = false;
    },
  },
});
</script>

<style lang="scss">
.catalog {
  display: flex;
  gap: 5%;
  justify-content: space-between;
  .signages {
    flex-grow: 5;
  }
  .categories {
    flex-grow: 4;
  }
}
</style>
