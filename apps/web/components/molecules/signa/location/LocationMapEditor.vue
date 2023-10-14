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
            <l-marker v-if="isPointEdition" :lat-lng="coordinates"></l-marker>
            <l-polyline
              v-if="isRoadEdition"
              :lat-lngs="coordinates"
            ></l-polyline>
            <l-polygon v-if="isAreaEdition" :lat-lngs="coordinates"></l-polygon>
          </l-map>
        </div>
      </client-only>
    </v-lazy>
    <div class="editor-container">
      <div>
        <v-select v-model="action" :items="actions"></v-select>
      </div>
      <v-btn :disabled="editionDone" @click="finishAction">
        Finir l'edition
      </v-btn>
      <v-btn @click="reset(action)"> Réinitialiser </v-btn>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  GeoJson,
  Coordinate,
  isPointLocation,
  POINT as POINT_LOCATION,
  ROAD as ROAD_LOCATION,
  AREA as AREA_LOCATION,
} from "@overbookd/signa";
import { Point } from "~/utils/signa-location/point";
import { Line } from "~/utils/signa-location/line";
import { Polygon } from "~/utils/signa-location/polygon";

const POINT = "Point";
const ROUTE = "Route";
const ZONE = "Zone";

type Action = typeof POINT | typeof ROUTE | typeof ZONE;

interface LocationMapEditorData {
  url: string;
  attribution: string;
  zoom: number;
  center: Coordinate;
  actions: Action[];
  editionDone: boolean;
  mouseLatlng: Coordinate;
  point: Point;
  line: Line;
  polygon: Polygon;
}

const center = { lat: 45.784045, lng: 4.876916 };

export default defineComponent({
  name: "LocationMapEditor",
  model: {
    prop: "value",
    event: "update:geo-json",
  },
  props: {
    value: {
      type: Object as () => GeoJson,
      default: null,
    },
  },
  emits: ["update:geo-json"],
  data: (): LocationMapEditorData => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 16,
    center,
    actions: [POINT, ROUTE, ZONE],
    editionDone: false,
    mouseLatlng: center,
    point: Point.create(),
    line: Line.create(),
    polygon: Polygon.create(),
  }),
  computed: {
    geoJson: {
      get(): GeoJson {
        return this.value;
      },
      set(geoJson: GeoJson) {
        this.$emit("update:geo-json", geoJson);
      },
    },
    action: {
      get(): Action {
        switch (this.geoJson?.type) {
          case ROAD_LOCATION:
            return ROUTE;
          case AREA_LOCATION:
            return ZONE;
          case POINT_LOCATION:
          default:
            return POINT;
        }
      },
      set(action: Action) {
        this.reset(action);
      },
    },
    isPointEdition(): boolean {
      return this.action === POINT;
    },
    isRoadEdition(): boolean {
      return this.action === ROUTE;
    },
    isAreaEdition(): boolean {
      return this.action === ZONE;
    },
    coordinates(): Coordinate | Coordinate[] {
      if (!this.geoJson) return center;

      if (isPointLocation(this.geoJson)) {
        return this.geoJson.coordinates;
      }

      return this.editionDone
        ? this.geoJson.coordinates
        : [...this.geoJson.coordinates, this.mouseLatlng];
    },
  },
  methods: {
    userHover({ latlng }: { latlng: Coordinate }) {
      this.mouseLatlng = latlng;
    },
    userAction({ latlng }: { latlng: Coordinate }) {
      if (this.editionDone) return;
      console.error("ICI");
      switch (this.action) {
        case POINT:
          this.point.addCoordinate(latlng);
          this.geoJson = this.point.geoJson;
          break;
        case ROUTE:
          this.line.addCoordinate(latlng);
          this.geoJson = this.line.geoJson;
          break;
        case ZONE:
          this.polygon.addCoordinate(latlng);
          this.geoJson = this.polygon.geoJson;
          break;
      }
    },
    finishAction() {
      this.editionDone = true;
    },
    reset(action: Action) {
      this.point = Point.create();
      this.line = Line.create();
      this.polygon = Polygon.create();
      switch (action) {
        case POINT:
          this.geoJson = this.point.geoJson;
          break;
        case ROUTE:
          this.geoJson = this.line.geoJson;
          break;
        case ZONE:
          this.geoJson = this.polygon.geoJson;
          break;
      }
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
