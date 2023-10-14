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
            :lat-lng="location.geoJson.coordinates"
          >
            <l-tooltip>{{ location.name }}</l-tooltip>
          </l-marker>
          <l-polyline
            v-for="(location, index) in roads"
            :key="index"
            :lat-lngs="location.geoJson.coordinates"
          >
            <l-tooltip>{{ location.name }}</l-tooltip>
          </l-polyline>
          <l-polygon
            v-for="(location, index) in areas"
            :key="index"
            :lat-lngs="location.geoJson.coordinates"
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
import {
  SignaLocation,
  PointLocation,
  RoadLocation,
  AreaLocation,
} from "@overbookd/signa";

export default defineComponent({
  name: "LocationMap",
  props: {
    locations: {
      type: Array as () => SignaLocation[],
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
    points(): SignaLocation<PointLocation>[] {
      return [];
    },
    roads(): SignaLocation<RoadLocation>[] {
      return [];
    },
    areas(): SignaLocation<AreaLocation>[] {
      return [];
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
