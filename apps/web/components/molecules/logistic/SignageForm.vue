<template>
  <v-card class="signage">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="signage__title">
      <h2>Signalisation</h2>
    </v-card-title>
    <v-card-text>
      <form>
        <div class="fields">
          <v-text-field
            v-model="name"
            append-icon="mdi-hammer-screwdriver"
            label="Nom de la signalisation"
            clearable
            outlined
            clear-icon="mdi-close-circle-outline"
            counter
            :rules="[rules.nameMinLength]"
          ></v-text-field>
          <SearchCategory
            v-model="category"
            label="Choisisez une catégorie associée"
          ></SearchCategory>
        </div>
        <v-btn color="success" dark large @click="createOrUpdateSignage">
          <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
          Sauvegarder la signalisation
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Category } from "~/utils/models/catalog.model";
import { InputRulesData, minLength } from "~/utils/rules/input.rules";
import SearchCategory from "../../atoms/field/search/SearchCategory.vue";
import { Signage, SignageForm } from "@overbookd/signa";

interface SignageFormData extends InputRulesData {
  name: string;
  category?: Category;
}

const nameMinLength = 3;

export default Vue.extend({
  name: "SignageForm",
  components: { SearchCategory },
  props: {
    signage: {
      type: Object,
      default: () => ({
        name: "",
        category: undefined,
      }),
    },
  },
  data(): SignageFormData {
    return {
      name: this.signage.name,
      category: this.signage.category,
      rules: { nameMinLength: minLength(nameMinLength) },
    };
  },
  computed: {
    shouldUpdateCategory(): boolean {
      return this.category || this.signage.category;
    },
  },
  watch: {
    signage(signage: Signage) {
      this.name = signage.name;
      this.category = signage.category;
    },
  },
  methods: {
    async createOrUpdateSignage() {
      let signage: SignageForm = { name: this.name };
      if (this.shouldUpdateCategory) {
        signage = { ...signage, category: this.category?.id };
      }
      const action = this.signage.id
        ? this.$accessor.catalogSignage.updateSignage({
            ...signage,
            id: this.signage.id,
          })
        : this.$accessor.catalogSignage.createSignage(signage);

      await action;
      this.closeDialog();
      this.name = "";
      this.category = undefined;
    },
    closeDialog(): void {
      this.$emit("close-dialog");
    },
  },
});
</script>

<style lang="scss" scoped>
.signage {
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
