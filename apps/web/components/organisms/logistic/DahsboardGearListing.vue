<template>
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
      <td :colspan="headers.length"><DashboardGearDetails /></td>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { GearPreview } from "@overbookd/http";
import { defineComponent } from "vue";
import DashboardGearDetails from "./DashboardGearDetails.vue";

export default defineComponent({
  name: "DashboardGearListing",
  components: { DashboardGearDetails },
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
  computed: {
    previews(): GearPreview[] {
      return this.$accessor.logisticDashboard.previews;
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
