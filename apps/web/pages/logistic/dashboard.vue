<template>
  <div>
    <h1>Récap Matos</h1>
    <GearFilter v-model="filter" @change="searchGears" />
    <v-expansion-panels>
      <v-expansion-panel v-for="preview in previews" :key="preview.slug">
        <v-expansion-panel-header>
          <div class="gear-recap__header-content">
            <h2>{{ preview.name }}</h2>
            <div v-show="preview.isConsumable" class="icon">
              <v-icon size="24"> mdi-delete-empty-outline </v-icon>
              <span class="icon-detail">Consommable</span>
            </div>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Contenu à définir
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { GearSearchOptions } from "~/store/catalogGear";
import GearFilter from "../../components/molecules/logistic/GearFilter.vue";
import { FilterGear } from "~/utils/models/filter-gear.model";
import { GearPreview } from "@overbookd/http";

interface GearRecapData {
  filter: FilterGear;
}

export default Vue.extend({
  name: "GearRecap",
  components: { GearFilter },
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
    previews(): GearPreview[] {
      return this.$accessor.logisticDashboard.previews;
    },
    canSearch(): boolean {
      const { name, category, team } = this.filter;
      return (
        [name, category?.path, team?.code].some((searchOption) =>
          this.isValidSearchOption(searchOption),
        ) || [name, category, team].every((searchOption) => !searchOption)
      );
    },
  },
  mounted() {
    this.$accessor.logisticDashboard.fetchPreviews();
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

<style lang="scss" scoped>
.gear-recap {
  &__header-content {
    display: flex;
    gap: 5px;
  }
}
.icon {
  position: relative;
  display: inline-block;
  .icon-detail {
    visibility: hidden;
    font-size: 0.8rem;
    text-align: center;
    user-select: none;
    z-index: 1;
    opacity: 0.75;
    @media only screen and (max-width: $mobile-max-width) {
      display: none;
    }
  }
}
.icon:hover .icon-detail {
  visibility: visible;
}
</style>
