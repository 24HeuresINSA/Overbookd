<template>
  <section class="map-section">
    <div class="map-container">
      <client-only>
        <l-map
          id="location-map"
          :zoom="zoom"
          :center="center"
          :options="{ name: 'LocationMap' }"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker
            v-for="(location, index) in points"
            :key="index"
            :lat-lng="location.coordinates.coordinates[0]"
          >
            <l-tooltip>{{ location.name }}</l-tooltip>
          </l-marker>
          <l-polyline
            v-for="(location, index) in lines"
            :key="index"
            :lat-lngs="location.coordinates.coordinates"
          >
            <l-tooltip>{{ location.name }}</l-tooltip>
          </l-polyline>
          <l-polygon
            v-for="(location, index) in polygons"
            :key="index"
            :lat-lngs="location.coordinates.coordinates"
          >
            <l-tooltip>{{ location.name }}</l-tooltip>
          </l-polygon>
        </l-map>
      </client-only>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Location, NotNullLocation } from "~/utils/models/signa-location.model";

export default defineComponent({
  name: "LocationMap",
  props: {
    locations: {
      type: Array<Location>,
      required: true,
    },
  },
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 16,
    center: [45.784045, 4.876916],
  }),
  computed: {
    filteredLocations(): NotNullLocation[] {
      return this.locations.filter((location) => location.coordinates) as NotNullLocation[];
    },
    points(): NotNullLocation[] {
      return this.filteredLocations
        .filter((location) => location.coordinates.type === "POINT");
    },
    lines(): NotNullLocation[] {
      return this.filteredLocations
        .filter((location) => location.coordinates.type === "ROAD");
    },
    polygons(): NotNullLocation[] {
      return this.filteredLocations
        .filter((location) => location.coordinates.type === "AREA");
    },
  },
});
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  z-index: 1;
  height: 40vh;
}

#location-map {
  cursor: auto;
}
</style>
