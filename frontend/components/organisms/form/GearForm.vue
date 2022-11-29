<template>
  <v-card class="gear">
    <v-card-title class="gear__title">
      <h2>Matos</h2>
      <v-btn icon dark @click="closeDialog">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
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
        <v-btn color="success" dark large @click="createOrUpdateGear">
          <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>Sauvegarder
          le matos
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { GearForm } from "~/store/catalog";
import { Category, Gear } from "~/utils/models/catalog.model";
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
  props: {
    gear: {
      type: Object,
      default: () => ({ name: "", category: undefined }),
    },
  },
  data(): GearFormData {
    return {
      name: this.gear.name,
      category: this.gear.category,
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
    shouldUpdateCategory() {
      return this.category || this.gear.category;
    },
  },
  watch: {
    gear: function (g: Gear) {
      console.log(g);
      this.name = g.name;
      this.category = g.category;
    },
  },
  methods: {
    async createOrUpdateGear() {
      let gear: GearForm = { name: this.name };
      if (this.shouldUpdateCategory()) {
        gear = { ...gear, category: this.category?.id };
      }
      const action = this.gear.id
        ? this.$accessor.catalog.updateGear({ ...gear, id: this.gear.id })
        : this.$accessor.catalog.createGear(gear);

      await action;
      this.closeDialog();
      this.name = "";
      this.category = undefined;
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.gear {
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
