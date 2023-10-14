<template>
  <section class="map-section">
    <v-lazy>
      <client-only>
        <div class="map">
          <l-map
            id="location-map-editor"
            :zoom="zoom"
            :center="center"
            :options="{ name: 'LocationMapEditor' }"
            @click="userAction"
            @mousemove="userHover"
          >
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker v-if="point" :lat-lng="point"></l-marker>
            <l-polyline v-if="line" :lat-lngs="line"></l-polyline>
            <l-polygon v-if="polygon" :lat-lngs="polygon"></l-polygon>
          </l-map>
        </div>
      </client-only>
    </v-lazy>
    <div class="editor-container">
      <div><v-select v-model="action" :items="actions"></v-select></div>
      <v-btn :disabled="editionDone" @click="finishAction">
        Finir l'edition
      </v-btn>
      <v-btn @click="reset"> Réinitialiser </v-btn>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GeoJson, Coordinate, PointLocation, RoadLocation, AreaLocation } from "@overbookd/signa";

export default defineComponent({
  name: "LocationMapEditor",
  props: {
    value: {
      type: Object as () => GeoJson,
      default: null,
    },
  },
  emits: ["input"],
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 16,
    center: [45.784045, 4.876916],
    action: "Point",
    actions: ["Point", "Ligne", "Zone"],
    editionDone: false,
    mouseLatlng: null as null | Coordinate,
  }),
  computed: {
    geoJson: {
      get(): GeoJson {
        return this.value;
      },
      set(geoJson: GeoJson) {
        this.$emit("input", geoJson);
      },
    },
    point(): null | PointLocation["coordinates"] {
      if (this.geoJson && this.geoJson.type === "POINT") {
        return this.geoJson.coordinates;
      }
      return null;
    },
    line(): null | RoadLocation["coordinates"] {
      if (this.geoJson && this.geoJson.type === "ROAD") {
        if (!this.editionDone && this.action === "Ligne" && this.mouseLatlng) {
          return [...this.geoJson.coordinates, this.mouseLatlng];
        }
        return this.geoJson.coordinates;
      }
      return null;
    },
    polygon(): null | AreaLocation["coordinates"] {
      if (this.geoJson && this.geoJson.type === "AREA") {
        if (!this.editionDone && this.action === "Zone" && this.mouseLatlng) {
          return [...this.geoJson.coordinates, this.mouseLatlng];
        }
        return this.geoJson.coordinates;
      }
      return null;
    },
  },
  methods: {
    userHover({ latlng }: { latlng: Coordinate }) {
      this.mouseLatlng = latlng;
    },
    userAction({ latlng }: { latlng: Coordinate }) {
      if (this.editionDone) return;
      switch (this.action) {
        case "Point":
          this.setPoint(latlng);
          break;
        case "Ligne":
          this.addLinePoint(latlng);
          break;
        case "Zone":
          this.addPolygonPoint(latlng);
          break;
      }
    },
    setPoint(latlng: Coordinate) {
      if (this.line || this.polygon) return;
      this.geoJson = {
        type: "POINT",
        coordinates: latlng,
      };
    },
    addLinePoint(latlng: Coordinate) {
      if (this.point || this.polygon) return;
      if (this.geoJson && this.geoJson.type === "ROAD") {
        this.geoJson.coordinates = [
          ...this.geoJson.coordinates,
          latlng,
        ];
      } else {
        this.geoJson = {
          type: "ROAD",
          coordinates: [latlng],
        };
      }
    },
    addPolygonPoint(latlng: Coordinate) {
      if (this.point || this.line) return;
      if (this.geoJson && this.geoJson.type === "AREA") {
        this.geoJson.coordinates = [
          ...this.geoJson.coordinates,
          latlng,
        ];
      } else {
        this.geoJson = {
          type: "AREA",
          coordinates: [latlng],
        };
      }
    },
    finishAction() {
      this.editionDone = true;
    },
    reset() {
      this.geoJson = null;
      this.editionDone = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.map {
  height: 60vh;
}

#location-map-editor {
  cursor: crosshair;
}

.editor-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor-container > * {
  width: 30%;
}
</style>
