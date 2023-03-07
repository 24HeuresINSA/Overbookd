<template>
  <v-card class="gear">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="gear__title">
      <h2>Matos</h2>
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
            :rules="[rules.nameMinLength]"
          ></v-text-field>
          <v-switch
            :input-value="isPonctualUsage"
            :muliple="false"
            label="Est du matos d'appoint"
            @change="updatePonctualUsage"
          ></v-switch>
          <v-switch
            :input-value="isConsumable"
            :muliple="false"
            label="Est du matos consommable"
            @change="updateConsumableStatus"
          ></v-switch>
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
import { InputRulesData, minLength } from "~/utils/rules/inputRules";
import SearchCategoryVue from "../../atoms/SearchCategory.vue";

interface GearFormData extends InputRulesData {
  name: string;
  category?: Category;
  isPonctualUsage: boolean;
  isConsumable: boolean;
}

const nameMinLength = 3;

export default Vue.extend({
  name: "GearForm",
  components: { SearchCategoryVue },
  props: {
    gear: {
      type: Object,
      default: () => ({
        name: "",
        category: undefined,
        isPonctualUsage: false,
        isConsumable: false,
      }),
    },
  },
  data(): GearFormData {
    return {
      name: this.gear.name,
      category: this.gear.category,
      isPonctualUsage: this.gear.isPonctualUsage,
      isConsumable: this.gear.isConsumable,
      rules: {
        nameMinLength: minLength(nameMinLength),
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
      this.name = g.name;
      this.category = g.category;
      this.isPonctualUsage = g.isPonctualUsage;
    },
  },
  methods: {
    async createOrUpdateGear() {
      let gear: GearForm = {
        name: this.name,
        isPonctualUsage: this.isPonctualUsage,
        isConsumable: this.isConsumable,
      };
      if (this.shouldUpdateCategory) {
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
    updatePonctualUsage(ponctualUsage: boolean | null) {
      this.isPonctualUsage = ponctualUsage ?? false;
    },
    updateConsumableStatus(consumable: boolean | null) {
      this.isConsumable = consumable ?? false;
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

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
