<template>
  <div>
    <h1>Catalogue</h1>
    <div class="catalog">
      <section class="gears">
        <GearListing></GearListing>
        <v-btn large color="success" rounded @click="openGearCreationDialog">
          <v-icon dark> mdi-plus </v-icon>Ajouter du matos</v-btn
        >
      </section>
      <CategoriesTreeView class="categories"></CategoriesTreeView>
    </div>
    <v-dialog v-model="gearCreationDialogOpened" width="600px">
      <GearForm @close-dialog="closeGearCreationDialog"></GearForm
    ></v-dialog>
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import CategoriesTreeView from "~/components/organisms/CategoriesTreeView.vue";
import GearForm from "~/components/organisms/form/GearForm.vue";
import GearListing from "~/components/organisms/GearListing.vue";

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
