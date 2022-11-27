<template>
  <v-card class="gear">
    <h2 class="gear__title">Gear</h2>
    <form>
      <div class="fields">
        <v-text-field
          v-model="name"
          append-icon="mdi-hammer-screwdriver"
          label="Nom du matos"
          clearable
          outlined
          clear-icon="mdi-close-circle-outline"
          counter
          :rules="[rules.name.minLength]"
        ></v-text-field>
        <SearchCategoryVue
          v-model="category"
          label="Choisisez une categorie associee"
        ></SearchCategoryVue>
      </div>
      <v-btn color="success" dark large @click="createGear">
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>Creer le matos
      </v-btn>
    </form>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { GearForm } from "~/store/catalog";
import { Category } from "~/utils/models/catalog.model";
import SearchCategoryVue from "../../atoms/SearchCategory.vue";

interface GearFormData {
  name: string;
  category?: Category;
  rules: {
    name: {
      minLength: (value: string | null) => boolean | string;
    };
  };
}

const nameMinLength = 3;

export default Vue.extend({
  name: "GearForm",
  components: { SearchCategoryVue },
  data(): GearFormData {
    return {
      name: "",
      category: undefined,
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
    async createGear() {
      let gear: GearForm = { name: this.name };
      if (this.category) {
        gear = { ...gear, category: this.category.id };
      }

      await this.$accessor.catalog.createGear(gear);
      this.name = "";
      this.category = undefined;
    },
  },
});
</script>

<style lang="scss" scoped>
.gear {
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
