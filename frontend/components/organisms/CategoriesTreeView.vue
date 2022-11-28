<template>
  <div>
    <h2 class="categories__title">Categories</h2>
    <v-treeview
      hoverable
      activatable
      :items="categories"
      item-children="subCategories"
    ></v-treeview>
    <v-btn dark large rounded color="amber" @click="openCreationDialog">
      <v-icon dark> mdi-plus </v-icon>
      Ajouter une categorie
    </v-btn>
    <v-dialog v-model="isCreateDialogOpen" width="600px">
      <CategoryFormVue @close-dialog="closeCreationDialog"></CategoryFormVue>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CategoryFormVue from "./form/CategoryForm.vue";

export default Vue.extend({
  name: "CategoriesTreeView",
  components: { CategoryFormVue },
  data() {
    return {
      isCreateDialogOpen: false,
    };
  },
  computed: {
    categories() {
      return this.$accessor.catalog.categoryTree;
    },
  },
  mounted() {
    this.$accessor.catalog.fetchCategoryTree();
  },
  methods: {
    openCreationDialog() {
      this.isCreateDialogOpen = true;
    },
    closeCreationDialog() {
      this.isCreateDialogOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.categories__title {
  margin-bottom: 1.2rem;
}
</style>
