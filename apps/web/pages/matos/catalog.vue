<template>
  <div>
    <h1>Catalogue Matos</h1>
    <div class="catalog">
      <section class="gears">
        <GearListing />
        <v-btn
          v-if="isCatalogWriter"
          large
          color="success"
          rounded
          @click="openGearCreationDialog"
        >
          <v-icon dark> mdi-plus </v-icon>Ajouter du matos
        </v-btn>
      </section>
      <CategoriesTreeView class="categories" />
    </div>
    <v-dialog v-model="gearCreationDialogOpened" width="600px">
      <GearForm @close-dialog="closeGearCreationDialog" />
    </v-dialog>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import CategoriesTreeView from "~/components/organisms/logistic/CategoriesTreeView.vue";
import GearForm from "~/components/molecules/logistic/GearForm.vue";
import GearListing from "~/components/organisms/logistic/GearListing.vue";

export default Vue.extend({
  name: "Catalog",
  components: {
    GearListing,
    CategoriesTreeView,
    SnackNotificationContainer,
    GearForm,
  },
  data() {
    return {
      gearCreationDialogOpened: false,
    };
  },
  head: () => ({
    title: "Catalogue Matos",
  }),
  computed: {
    isCatalogWriter(): boolean {
      return this.$accessor.user.can("write-matos-catalog");
    },
  },
  methods: {
    openGearCreationDialog() {
      this.gearCreationDialogOpened = true;
    },
    closeGearCreationDialog() {
      this.gearCreationDialogOpened = false;
    },
  },
});
</script>

<style lang="scss">
form {
  margin-bottom: 1.2rem;
}
.filter {
  display: flex;
  gap: 5%;
  justify-content: space-evenly;
  .v-input {
    flex-grow: 1;
  }
}
.creation {
  display: flex;
  gap: 5%;
}
.catalog {
  display: flex;
  gap: 5%;
  justify-content: space-between;
  .gears {
    flex-grow: 5;
  }
  .categories {
    flex-grow: 4;
  }
}
</style>
