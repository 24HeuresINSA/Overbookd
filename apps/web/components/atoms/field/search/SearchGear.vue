<template>
  <v-autocomplete
    :value="gear"
    :items="gears"
    :loading="loading"
    item-text="name"
    chips
    clearable
    :filled="boxed"
    item-value="id"
    :label="label"
    :solo="boxed"
    return-object
    :dense="dense"
    :filter="matchingGear"
    :hide-details="dense"
    :disabled="disabled"
    @update:search-input="searchGear"
    @change="propagateEvent"
    @focus="initList"
  >
    <template #item="listedGear">
      <v-list-item-content>
        <v-list-item-title v-text="listedGear.item.name"></v-list-item-title>
        <v-list-item-subtitle
          v-text="listedGear.item.category?.path"
        ></v-list-item-subtitle>
      </v-list-item-content>
    </template>
    <template #no-data>
      <v-list-item> Aucun matos correspondant </v-list-item>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import { SlugifyService } from "@overbookd/slugify";
import Vue from "vue";
import { CatalogGear, GearSearchOptions } from "@overbookd/http";

type SearchGearData = {
  gear?: CatalogGear;
  loading: boolean;
};

export default Vue.extend({
  name: "SearchGear",
  model: {
    prop: "gear",
    event: "change",
  },
  props: {
    label: {
      type: String,
      default: "Chercher du matos",
    },
    gear: {
      type: Object,
      default: undefined,
    },
    owner: {
      type: String,
      default: "",
    },
    ponctualUsage: {
      type: Boolean,
      default: undefined,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    boxed: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data(): SearchGearData {
    return {
      loading: false,
    };
  },
  computed: {
    gears() {
      return this.$accessor.catalogGear.gears;
    },
  },
  methods: {
    searchGear(gearName: string | null) {
      if (gearName && gearName.length < 3) return;
      const searchOptions = this.buildSearchOptions(gearName);
      this.fetchGears(searchOptions);
    },
    initList() {
      const searchOptions = this.buildSearchOptions(null);
      this.fetchGears(searchOptions);
    },
    buildSearchOptions(gearName: string | null): GearSearchOptions {
      const nameOption = gearName ? { name: gearName } : {};
      const ownerOption = this.owner ? { owner: this.owner } : {};
      const ponctualUsageOption =
        this.ponctualUsage !== undefined
          ? { ponctualUsage: this.ponctualUsage }
          : {};
      return { ...nameOption, ...ownerOption, ...ponctualUsageOption };
    },
    async fetchGears(searchOptions: GearSearchOptions) {
      this.loading = true;
      await this.$accessor.catalogGear.fetchGears(searchOptions);
      this.loading = false;
    },
    propagateEvent(gear: CatalogGear) {
      this.$emit("change", gear);
    },
    matchingGear(gear: CatalogGear, queryText: string | null) {
      if (queryText === null) return true;
      const search = SlugifyService.apply(queryText);
      return gear.slug.includes(search);
    },
  },
});
</script>
