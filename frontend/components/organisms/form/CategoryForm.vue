<template>
  <v-card class="category">
    <v-card-title class="category__title">
      <h2>Categorie</h2>
      <v-btn icon @click="closeDialog">
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
        <v-btn color="success" dark large @click="createOrUpdateCategory">
          <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>Sauvegarder
          la categorie
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
  owner?: Pick<team, "code" | "name">;
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
  props: {
    category: {
      type: Object,
      default: () => ({ name: "", owner: undefined, parent: undefined }),
    },
  },
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
  computed: {
    shouldUpdateParent() {
      return this.parent || this.category.parent;
    },
    shouldUpdateOwner() {
      return this.owner || this.category.owner;
    },
  },
  watch: {
    category: async function (c: Category) {
      this.spreadCategory(c);
    },
  },
  async mounted() {
    await this.spreadCategory(this.category);
  },
  methods: {
    async spreadCategory({ name, owner, parent }: Category) {
      this.name = name;
      this.owner = owner;
      this.parent = parent
        ? await this.$accessor.catalog.fetchCategory(parent)
        : undefined;
    },
    async createOrUpdateCategory() {
      const category = this.buildCategoryForm();

      const action = this.category.id
        ? this.$accessor.catalog.updateCategory({
            ...category,
            id: this.category.id,
          })
        : this.$accessor.catalog.createCategory(category);

      await action;
      this.name = "";
      this.owner = undefined;
      this.parent = undefined;
      this.$emit("save");
      this.closeDialog();
    },
    buildCategoryForm(): CategoryForm {
      const name = { name: this.name };
      const parent = this.shouldUpdateParent ? { parent: this.parent?.id } : {};
      const owner = this.shouldUpdateOwner ? { owner: this.owner?.code } : {};

      return { ...name, ...parent, ...owner };
    },
    async getCategory(categoryId: number): Promise<Category | undefined> {
      return this.$accessor.catalog.fetchCategory(categoryId);
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
    .fields {
      width: 80%;
    }
  }
}
</style>
