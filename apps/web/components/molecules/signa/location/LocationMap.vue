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
            :key="`point-${index}`"
            :lat-lng="location.geoJson.coordinates"
            @click="showLocation(location)"
          >
            <l-tooltip>{{ location.name }}</l-tooltip>
          </l-marker>
          <l-polyline
            v-for="(location, index) in roads"
            :key="`road-${index}`"
            :lat-lngs="location.geoJson.coordinates"
            @click="showLocation(location)"
          >
            <l-tooltip>{{ location.name }}</l-tooltip>
          </l-polyline>
          <l-polygon
            v-for="(location, index) in areas"
            :key="`area-${index}`"
            :lat-lngs="location.geoJson.coordinates"
            @click="showLocation(location)"
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
  POINT,
  ROAD,
  AREA,
  SignaLocation,
  PointLocation,
  RoadLocation,
  AreaLocation,
  filterLocation,
} from "@overbookd/signa";
import { mapConfiguration } from "~/utils/models/signa-location.model";

export default defineComponent({
  name: "LocationMap",
  props: {
    locations: {
      type: Array as () => SignaLocation[],
      required: true,
    },
  },
  emits: ['show:location'],
  data: () => ({
    ...mapConfiguration,
  }),
  computed: {
    points(): SignaLocation<PointLocation>[] {
      return filterLocation(POINT, this.locations);
    },
    roads(): SignaLocation<RoadLocation>[] {
      return filterLocation(ROAD, this.locations);
    },
    areas(): SignaLocation<AreaLocation>[] {
      return filterLocation(AREA, this.locations);
    },
  },
  methods: {
    showLocation(location: SignaLocation) {
      this.$emit('show:location', location);
    }
  }
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
