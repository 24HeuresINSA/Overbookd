<template>
  <div>
    <h1>Récap Matos</h1>
    <GearFilter v-model="filter" @change="searchGears" />
    <DahsboardGearListing />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GearSearchOptions } from "~/store/catalogGear";
import GearFilter from "../../components/molecules/logistic/GearFilter.vue";
import { FilterGear } from "~/utils/models/filter-gear.model";
import DahsboardGearListing from "~/components/organisms/logistic/DahsboardGearListing.vue";

interface GearRecapData {
  filter: FilterGear;
}

export default Vue.extend({
  name: "GearRecap",
  components: { GearFilter, DahsboardGearListing },
  data(): GearRecapData {
    return {
      filter: {
        name: "",
        category: null,
        team: null,
      },
    };
  },
  head: () => ({
    title: "Récap Matos",
  }),
  computed: {
    canSearch(): boolean {
      const { name, category, team } = this.filter;
      return (
        [name, category?.path, team?.code].some((searchOption) =>
          this.isValidSearchOption(searchOption),
        ) || [name, category, team].every((searchOption) => !searchOption)
      );
    },
  },
  methods: {
    async searchGears() {
      if (!this.canSearch) return;
      const searchOptions = this.buildSearchOptions();
      await this.$accessor.catalogGear.fetchGears(searchOptions);
    },
    isValidSearchOption(searchOption: string | null | undefined): boolean {
      return Boolean(searchOption);
    },
    buildSearchOptions(): GearSearchOptions {
      const { name, category, team } = this.filter;
      let searchOptions = {};
      if (this.isValidSearchOption(name)) {
        searchOptions = { ...searchOptions, name };
      }
      if (this.isValidSearchOption(category?.path)) {
        searchOptions = { ...searchOptions, category: category?.path };
      }
      if (this.isValidSearchOption(team?.code)) {
        searchOptions = { ...searchOptions, owner: team?.code };
      }
      return searchOptions;
    },
  },
});
</script>
