<template>
  <div>
    <h1>Récap Matos</h1>
    <GearFilter v-model="filter" @change="searchGears" />
    <div class="datepicker">
      <div>
        <h3>Début du créneau</h3>
        <DateTimeField
          v-model="start"
          label="Début"
          @change="updateSelectedGear"
        />
      </div>
      <div>
        <h3>Fin du créneau</h3>
        <DateTimeField v-model="end" label="Fin" @change="updateSelectedGear" />
      </div>
    </div>
    <DahsboardGearListing :start="start" :end="end" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GearFilter from "../../components/molecules/logistic/GearFilter.vue";
import { FilterGear } from "~/utils/models/filter-gear.model";
import DahsboardGearListing from "~/components/organisms/logistic/DahsboardGearListing.vue";
import DateTimeField from "~/components/atoms/field/date/DateTimeField.vue";
import { ONE_DAY_IN_MS } from "@overbookd/period";
import { GearSearchOptions } from "@overbookd/http";

const FOUR_DAYS_IN_MS = 4 * ONE_DAY_IN_MS;

type GearRecapData = {
  filter: FilterGear;
  start: Date;
  end: Date;
}

export default Vue.extend({
  name: "GearRecap",
  components: { GearFilter, DahsboardGearListing, DateTimeField },
  data(): GearRecapData {
    return {
      filter: {
        name: "",
        category: null,
        team: null,
      },
      start: new Date(),
      end: new Date(),
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
  async mounted() {
    await this.$accessor.configuration.fetch("eventDate");
    this.start = this.$accessor.configuration.eventStartDate;
    this.end = new Date(this.start.getTime() + FOUR_DAYS_IN_MS);
  },
  methods: {
    async searchGears() {
      if (!this.canSearch) return;
      const searchOptions = this.buildSearchOptions();
      await this.$accessor.logisticDashboard.fetchPreviews(searchOptions);
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
    updateSelectedGear() {
      if (this.$accessor.logisticDashboard.selectedGear === undefined) return;
      this.$accessor.logisticDashboard.fetchDetails({
        slug: this.$accessor.logisticDashboard.selectedGear.slug,
        start: this.start,
        end: this.end,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.datepicker {
  display: flex;
  gap: 2rem;
  align-items: center;
}
</style>
