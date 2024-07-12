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
          v-for="(location, index) in points"
          :key="`point-${index}`"
          :lat-lng="location.geoLocation.coordinates"
          @click="showLocation(location)"
        >
          <l-tooltip>{{ location.name }}</l-tooltip>
        </l-marker>
        <l-polyline
          v-for="(location, index) in roads"
          :key="`road-${index}`"
          :lat-lngs="location.geoLocation.coordinates"
          @click="showLocation(location)"
        >
          <l-tooltip>{{ location.name }}</l-tooltip>
        </l-polyline>
        <l-polygon
          v-for="(location, index) in areas"
          :key="`area-${index}`"
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
import { mapConfiguration } from "~/utils/location/map";

const props = defineProps({
  locations: {
    type: Array as PropType<SignaLocation[]>,
    required: true,
  },
});

const map = ref({ ...mapConfiguration });

const points = computed(() => filterLocation(POINT, props.locations));
const roads = computed(() => filterLocation(ROAD, props.locations));
const areas = computed(() => filterLocation(AREA, props.locations));

const emit = defineEmits(["show:location"]);
const showLocation = (location: SignaLocation) => {
  emit("show:location", location);
};
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
