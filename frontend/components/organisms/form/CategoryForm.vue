<template>
  <v-card class="category">
    <v-card-title class="category__title">
      <h2>Categorie</h2>
      <v-btn icon dark @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
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
        <SearchTeamVue
          v-model="owner"
          label="Choissisez l'equipe responsable"
        ></SearchTeamVue>
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
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchTeamVue from "~/components/atoms/SearchTeam.vue";
import { CategoryForm } from "~/store/catalog";
import { Category } from "~/utils/models/catalog.model";
import { team } from "~/utils/models/repo";
import SearchCategoryVue from "../../atoms/SearchCategory.vue";

interface CategoryFormData {
  name: string;
  owner?: team;
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
  components: { SearchCategoryVue, SearchTeamVue },
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
        category = { ...category, owner: this.owner.code };
      }

      await this.$accessor.catalog.createCategory(category);
      this.name = "";
      this.owner = undefined;
      this.parent = undefined;
      this.closeDialog();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.category {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .fields{
      width: 80%;
    }
  }
}
</style>
