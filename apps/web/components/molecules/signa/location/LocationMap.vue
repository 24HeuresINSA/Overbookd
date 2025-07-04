<template>
  <section class="map-section">
    <div class="map-container">
      <l-map
        id="location-map"
        :zoom="map.zoom"
        :center="map.center"
        :use-global-leaflet="false"
      >
        <l-tile-layer :url="map.url" :attribution="map.attribution" />
        <l-marker
          v-for="location in points"
          :key="location.id"
          :lat-lng="location.geoLocation.coordinates"
          @click="showLocation(location)"
        >
          <l-tooltip>{{ location.name }}</l-tooltip>
        </l-marker>
        <l-polyline
          v-for="location in roads"
          :key="location.id"
          :lat-lngs="location.geoLocation.coordinates"
          @click="showLocation(location)"
        >
          <l-tooltip>{{ location.name }}</l-tooltip>
        </l-polyline>
        <l-polygon
          v-for="location in areas"
          :key="location.id"
          :lat-lngs="location.geoLocation.coordinates"
          @click="showLocation(location)"
        >
          <l-tooltip>{{ location.name }}</l-tooltip>
        </l-polygon>
      </l-map>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { POINT, ROAD, AREA } from "@overbookd/geo-location";
import { type SignaLocation, filterLocation } from "@overbookd/signa";
import {
  type MapConfiguration,
  defaultMapConfiguration,
} from "~/utils/map.config";

const props = defineProps({
  locations: {
    type: Array as PropType<SignaLocation[]>,
    required: true,
  },
});

const map = ref<MapConfiguration>({ ...defaultMapConfiguration });

const points = computed(() => filterLocation(POINT, props.locations));
const roads = computed(() => filterLocation(ROAD, props.locations));
const areas = computed(() => filterLocation(AREA, props.locations));

const emit = defineEmits(["show:location"]);
const showLocation = (location: SignaLocation) => {
  emit("show:location", location);
};
</script>

<style scoped>
.map-container {
  position: relative;
  z-index: 1;
  height: 40vh;
}

#location-map {
  cursor: auto;
}
</style>
