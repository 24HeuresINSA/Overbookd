<template>
  <v-card class="category">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="category__title">
      <h2>Categorie</h2>
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
            :rules="[rules.nameMinLength]"
          ></v-text-field>
          <SearchTeamVue
            v-model="owner"
            label="Choisis l'équipe responsable"
          ></SearchTeamVue>
          <SearchCategoryVue
            v-model="parent"
            label="Choisis un parent"
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
import SearchTeamVue from "~/components/atoms/field/search/SearchTeam.vue";
import SearchCategoryVue from "../../atoms/field/search/SearchCategory.vue";
import { InputRulesData, minLength } from "~/utils/rules/input.rules";
import { CatalogCategory, CategoryForm, Team } from "@overbookd/http";

type CategoryFormData = InputRulesData & {
  name: string;
  owner?: Pick<Team, "code" | "name">;
  parent?: CatalogCategory;
};

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
        nameMinLength: minLength(nameMinLength),
      },
    };
  },
  computed: {
    shouldUpdateParent(): boolean {
      return this.parent || this.category.parent;
    },
    shouldUpdateOwner(): boolean {
      return this.owner || this.category.owner;
    },
  },
  watch: {
    category: async function (category: CatalogCategory) {
      this.spreadCategory(category);
    },
  },
  async mounted() {
    await this.spreadCategory(this.category);
  },
  methods: {
    async spreadCategory({
      name,
      owner,
      parent,
    }: CatalogCategory): Promise<void> {
      this.name = name;
      this.owner = owner;
      this.parent = parent
        ? await this.$accessor.catalog.fetchCategory(parent)
        : undefined;
    },
    async createOrUpdateCategory(): Promise<void> {
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
    async getCategory(
      categoryId: number,
    ): Promise<CatalogCategory | undefined> {
      return this.$accessor.catalog.fetchCategory(categoryId);
    },
    closeDialog(): void {
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

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
