<template>
  <div>
    <v-card class="category-details">
      <v-btn class="close-btn" icon @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-card-title class="category-details__title">
        <h2>{{ category.name }}</h2>
      </v-card-title>
      <v-card-subtitle class="category-details__subtitle">
        {{ category.path }}
      </v-card-subtitle>
      <v-card-text>
        <p v-show="category.owner" class="category-details__owner">
          Gere par {{ category.owner?.name }}
        </p>
      </v-card-text>
      <v-card-actions>
        <div class="btn-group">
          <v-btn color="success" dark large @click="openCategoryUpdateDialog">
            <v-icon left> mdi-pencil </v-icon>Modifier
          </v-btn>
          <v-btn color="error" large dark @click="openCategoryDeleteDialog"
            ><v-icon left> mdi-delete </v-icon>Supprimer</v-btn
          >
          <v-btn color="warning" dark large @click="closeDialog">
            <v-icon left> mdi-close-circle-outline </v-icon>Annuler
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="isDeleteDialogOpen" width="600px">
      <ConfirmationMessage
        confirm-color="error"
        @close-dialog="closeCategoryDeleteDialog"
        @confirm="deleteCategory"
      >
        <template #title>Suppression de la Categorie</template>
        <template #statement
          >Vous etes sur le point de supprimer
          <strong>{{ category.name }}</strong></template
        >
        <template #confirm-btn-content>
          <v-icon left> mdi-delete </v-icon>Supprimer
        </template>
      </ConfirmationMessage>
    </v-dialog>
    <v-dialog v-model="isUpdateDialogOpen" width="600px">
      <CategoryForm
        :category="category"
        @close-dialog="closeCategoryUpdateDialog"
        @save="closeDialog"
      ></CategoryForm>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ConfirmationMessage from "../atoms/ConfirmationMessage.vue";
import CategoryForm from "./form/CategoryForm.vue";

export default Vue.extend({
  name: "CategoryDetails",
  components: { ConfirmationMessage, CategoryForm },
  props: {
    category: {
      type: Object,
      default: () => ({}),
    },
  },
  data(): { isDeleteDialogOpen: boolean; isUpdateDialogOpen: boolean } {
    return {
      isDeleteDialogOpen: false,
      isUpdateDialogOpen: false,
    };
  },
  methods: {
    openCategoryUpdateDialog() {
      this.isUpdateDialogOpen = true;
    },
    openCategoryDeleteDialog() {
      this.isDeleteDialogOpen = true;
    },
    closeCategoryDeleteDialog() {
      this.isDeleteDialogOpen = false;
    },
    closeCategoryUpdateDialog() {
      this.isUpdateDialogOpen = false;
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    async deleteCategory() {
      await this.$accessor.catalog.deleteCategory(this.category);
      this.closeDialog();
    },
  },
});
</script>

<style lang="scss" scoped>
.category-details {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__subtitle {
    text-align: center;
  }
  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
  .btn-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 3%;
    .v-btn {
      flex-grow: 1;
    }
  }
}
</style>
