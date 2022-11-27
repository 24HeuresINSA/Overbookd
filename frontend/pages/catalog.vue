<template>
  <div>
    <h1>Catalogue</h1>
    <div class="catalog">
      <sectionclass class="gears">
        <GearListing></GearListing>
        <v-btn large color="success" rounded @click="openGearCreationDialog">
          <v-icon dark> mdi-plus </v-icon>Ajouter du matos</v-btn
        >
      </sectionclass>
      <CategoriesTreeView class="categories"></CategoriesTreeView>
      <snackNotificationContainerVue></snackNotificationContainerVue>
    </div>
    <v-dialog v-model="gearCreationDialogOpened" width="600px">
      <GearForm></GearForm
    ></v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import snackNotificationContainerVue from "~/components/molecules/snackNotificationContainer.vue";
import CategoriesTreeView from "~/components/organisms/CategoriesTreeView.vue";
import GearForm from "~/components/organisms/form/GearForm.vue";
import GearListing from "~/components/organisms/GearListing.vue";

export default Vue.extend({
  name: "Catalog",
  components: {
    GearListing,
    CategoriesTreeView,
    snackNotificationContainerVue,
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
