<template>
  <form class="filter">
    <v-text-field
      v-model="name"
      append-icon="mdi-hammer-screwdriver"
      label="Nom du matos"
      autofocus
      clearable
      clear-icon="mdi-close-circle-outline"
      counter
      @input="deferFilterGearUpdate"
      @keydown="updateFilterGearOnEnter"
    ></v-text-field>
    <SearchCategory
      v-model="category"
      :boxed="false"
      @change="updateFilterGear"
    ></SearchCategory>
    <SearchTeam
      v-model="team"
      label="Choissisez l'equipe responsable"
      :boxed="false"
      @change="updateFilterGear"
    ></SearchTeam>
  </form>
</template>

<script lang="ts">
import Vue from "vue";
import SearchCategory from "../../atoms/field/search/SearchCategory.vue";
import SearchTeam from "../../atoms/field/search/SearchTeam.vue";
import { FilterGear } from "~/utils/models/filter-gear.model";

interface GearFilterData extends FilterGear {
  delay?: ReturnType<typeof setTimeout>;
}

export default Vue.extend({
  name: "GearFilter",
  components: {
    SearchTeam,
    SearchCategory,
  },
  model: {
    prop: "filter",
    event: "change",
  },
  props: {
    filter: {
      type: Object as () => FilterGear,
      required: true,
    },
  },
  data(): GearFilterData {
    return {
      name: "",
      category: null,
      team: null,
    };
  },
  watch: {
    filter() {
      this.name = this.filter.name;
      this.category = this.filter.category;
      this.team = this.filter.team;
    },
  },
  methods: {
    updateFilterGear() {
      const filter: FilterGear = {
        name: this.name,
        category: this.category,
        team: this.team,
      };
      this.$emit("change", filter);
    },
    deferFilterGearUpdate() {
      if (this.delay) clearInterval(this.delay);
      this.delay = setTimeout(this.updateFilterGear, 800);
    },
    updateFilterGearOnEnter(keyEvent: KeyboardEvent) {
      if (keyEvent.key !== "Enter") return;
      return this.updateFilterGear();
    },
  },
});
</script>

<style lang="scss">
form {
  margin-bottom: 1.2rem;
}
.filter {
  display: flex;
  gap: 5%;
  justify-content: space-evenly;
  .v-input {
    flex-grow: 1;
  }
}
</style>
