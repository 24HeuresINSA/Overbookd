<template>
  <v-card class="category">
    <h2 class="category__title">Categorie</h2>
    <form>
      <div class="fields">
        <v-text-field
          v-model="name"
          append-icon="mdi-label"
          label="Nom de la categorie"
          clearable
          outlined
          clear-icon="mdi-close-circle-outline"
          counter
          :rules="[rules.name.minLength]"
        ></v-text-field>
        <v-text-field
          v-model="owner"
          append-icon="mdi-account-multiple"
          label="Nom de l'equipe responsable"
          clearable
          outlined
          clear-icon="mdi-close-circle-outline"
        ></v-text-field>
        <SearchCategoryVue
          v-model="parent"
          label="Choisisez un parent"
        ></SearchCategoryVue>
      </div>
      <v-btn color="success" dark large @click="createCategory">
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>Creer la
        categorie
      </v-btn>
    </form>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { CategoryForm } from "~/store/catalog";
import { Category } from "~/utils/models/catalog.model";
import SearchCategoryVue from "../../atoms/SearchCategory.vue";

interface CategoryFormData {
  name: string;
  owner?: string;
  parent?: Category;
  rules: {
    name: {
      minLength: (value: string | null) => boolean | string;
    };
  };
}

const nameMinLength = 3;

export default Vue.extend({
  name: "CategoryForm",
  components: { SearchCategoryVue },
  data(): CategoryFormData {
    return {
      name: "",
      owner: undefined,
      parent: undefined,
      rules: {
        name: {
          minLength: (value) =>
            (value && value.length >= nameMinLength) ||
            `Taper au moins ${nameMinLength} caracteres`,
        },
      },
    };
  },
  methods: {
    async createCategory() {
      let category: CategoryForm = { name: this.name };
      if (this.parent) {
        category = { ...category, parent: this.parent.id };
      }
      if (this.owner) {
        category = { ...category, owner: this.owner };
      }

      await this.$accessor.catalog.createCategory(category);
      this.name = "";
      this.owner = undefined;
      this.parent = undefined;
    },
  },
});
</script>

<style lang="scss" scoped>
.category {
  display: flex;
  flex-direction: column;
  align-items: center;
  &__title {
    margin-top: 1.2rem;
    margin-bottom: 1.2rem;
  }
  form {
    width: 80%;
    display: flex;
    flex-direction: column;
    .fields {
      flex-direction: column;
      display: flex;
    }
  }
}
</style>
