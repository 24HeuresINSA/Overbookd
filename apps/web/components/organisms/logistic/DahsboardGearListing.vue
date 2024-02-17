<template>
  <div class="dashboard-gear-listing">
    <v-data-table
      :items="previews"
      :headers="headers"
      show-expand
      single-expand
      @item-expanded="selectGear"
    >
      <template #item.isConsumable="{ item }">
        <div v-show="item.isConsumable" class="icon">
          <v-icon size="24"> mdi-delete-empty-outline </v-icon>
          <span class="icon-detail">Consommable</span>
        </div>
      </template>
      <template #expanded-item>
        <td :colspan="headers.length">
          <DashboardGearDetailsGraph @select:gear-details="selectGearDetails" />
        </td>
      </template>
      <template #no-data>Aucun matos</template>
    </v-data-table>
    <v-dialog v-model="isGearDetailsOpen" max-width="1200">
      <DashboardGearDetailsCard
        v-if="selectedGearDetails"
        :gear-details="selectedGearDetails"
        @close-dialog="closeDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GearDetails, GearPreview, GearWithDetails } from "@overbookd/http";
import DashboardGearDetailsGraph from "./DashboardGearDetailsGraph.vue";
import DashboardGearDetailsCard from "./DashboardGearDetailsCard.vue";

type DashboardGearListingData = {
  selectedGearDetails: (GearDetails & { name: string }) | undefined;
  isGearDetailsOpen: boolean;
};

export default defineComponent({
  name: "DashboardGearListing",
  components: { DashboardGearDetailsGraph, DashboardGearDetailsCard },
  props: {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
  },
  data: (): DashboardGearListingData => ({
    selectedGearDetails: undefined,
    isGearDetailsOpen: false,
  }),
  computed: {
    previews(): GearPreview[] {
      return this.$accessor.logisticDashboard.previews;
    },
    selectedGear(): GearWithDetails | undefined {
      return this.$accessor.logisticDashboard.selectedGear;
    },
    headers() {
      return [
        { text: "Matos", value: "name" },
        { text: "Matos consommable", value: "isConsumable" },
        { text: "Delta", value: "stockDiscrepancy" },
      ];
    },
  },
  mounted() {
    this.$accessor.logisticDashboard.fetchPreviews();
  },
  methods: {
    selectGear(event: { item: GearPreview; value: boolean }) {
      const closingDetails = !event.value;
      if (closingDetails) return;
      this.$accessor.logisticDashboard.fetchDetails({
        slug: event.item.slug,
        start: this.start,
        end: this.end,
      });
    },
    selectGearDetails(index: number) {
      if (!this.selectedGear) return;
      const details = this.selectedGear.details.at(index);
      if (!details) return;

      this.selectedGearDetails = { ...details, name: this.selectedGear.name };
      this.isGearDetailsOpen = true;
    },
    closeDialog() {
      this.isGearDetailsOpen = false;
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
