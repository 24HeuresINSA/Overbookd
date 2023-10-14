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
            v-for="(latlng, index) in points"
            :key="index"
            :lat-lng="latlng"
          >
            <l-tooltip>Hello!</l-tooltip>
          </l-marker>
          <l-polyline
            v-for="(line, index) in lines"
            :key="index"
            :lat-lngs="line"
          >
            <l-tooltip>Hello!</l-tooltip>
          </l-polyline>
          <l-polygon
            v-for="(polygon, index) in polygons"
            :key="index"
            :lat-lngs="polygon"
          >
            <l-tooltip>Hello!</l-tooltip>
          </l-polygon>
        </l-map>
      </client-only>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LocationMap",
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 16,
    center: [45.784045, 4.876916],
    points: [] as number[][],
    lines: [] as number[][][],
    polygons: [] as number[][][],
  }),
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
