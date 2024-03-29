<template>
  <section class="map-section">
    <p class="instructions">
      Pour activer et désactiver la modification sur la carte tu peux utiliser
      le clic droit.
    </p>
    <v-switch v-model="editing" class="editing" inset label="Mode édition" />
    <v-lazy>
      <client-only>
        <div class="map">
          <l-map
            id="location-map-editor"
            :zoom="zoom"
            :center="center"
            :options="{ name: 'LocationMapEditor' }"
            @click="userAction"
            @contextmenu="switchEditing"
            @mousemove="userHover"
            @update:zoom="updateZoom"
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
        <v-select
          v-model="action"
          :items="actions"
          item-text="value"
          item-value="key"
        ></v-select>
      </div>
      <v-btn @click="reset(action)">Réinitialiser</v-btn>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  GeoJson,
  Coordinate,
  isPointLocation,
  POINT,
  ROAD,
  AREA,
} from "@overbookd/signa";
import { Point } from "~/utils/signa-location/point";
import { Line } from "~/utils/signa-location/line";
import { Polygon } from "~/utils/signa-location/polygon";
import { mapConfiguration } from "~/utils/models/signa-location.model";
import { Location } from "~/utils/signa-location/location";

type Action = typeof POINT | typeof ROAD | typeof AREA;
type ActionItem = {
  key: Action;
  value: string;
};

type LocationMapEditorData = {
  url: string;
  attribution: string;
  zoom: number;
  center: Coordinate;
  actions: ActionItem[];
  editing: boolean;
  mouseLatlng: Coordinate;
  location: Location;
};

const actions: ActionItem[] = [
  { key: POINT, value: "Point" },
  { key: ROAD, value: "Route" },
  { key: AREA, value: "Zone" },
];

export default defineComponent({
  name: "LocationMapEditor",
  model: {
    prop: "value",
    event: "update:geo-json",
  },
  props: {
    value: {
      type: Object as () => GeoJson,
      required: true,
    },
  },
  emits: ["update:geo-json"],
  data: (): LocationMapEditorData => ({
    ...mapConfiguration,
    actions,
    editing: false,
    mouseLatlng: mapConfiguration.center,
    location: Point.create(mapConfiguration.center),
  }),
  computed: {
    geoJson: {
      get(): GeoJson {
        return this.value;
      },
      set(geoJson: GeoJson) {
        this.$emit("update:geo-json", geoJson);
        this.setLocation(geoJson);
      },
    },
    action: {
      get(): Action {
        return this.geoJson?.type ?? POINT;
      },
      set(action: Action) {
        this.reset(action);
      },
    },
    isPointEdition(): boolean {
      return this.action === POINT;
    },
    isRoadEdition(): boolean {
      return this.action === ROAD;
    },
    isAreaEdition(): boolean {
      return this.action === AREA;
    },
    previewNextCoordinate(): boolean {
      if (isPointLocation(this.geoJson)) return false;

      return this.editing;
    },
    coordinates(): Coordinate | Coordinate[] {
      if (!this.geoJson) return mapConfiguration.center;

      return isPointLocation(this.geoJson) || !this.editing
        ? this.geoJson.coordinates
        : [...this.geoJson.coordinates, this.mouseLatlng];
    },
  },
  mounted() {
    this.setLocation(this.geoJson);
    this.initEditing();
  },
  methods: {
    initEditing() {
      this.editing = this.geoJson === null;
    },
    updateZoom(zoom: number) {
      this.zoom = zoom;
    },
    switchEditing() {
      this.editing = !this.editing;
    },
    userHover({ latlng }: { latlng: Coordinate }) {
      this.mouseLatlng = latlng;
    },
    userAction({ latlng }: { latlng: Coordinate }) {
      if (!this.editing) return;
      this.location.addCoordinate(latlng);
      this.geoJson = this.location.geoJson;
    },
    setLocation(geoJson: GeoJson) {
      if (!geoJson) {
        this.location = Point.create(this.center);
        return;
      }
      switch (geoJson.type) {
        case POINT:
          this.location = Point.create(geoJson.coordinates);
          break;
        case "ROAD":
          this.location = Line.create(geoJson.coordinates);
          break;
        case "AREA":
          this.location = Polygon.create(geoJson.coordinates);
          break;
      }
    },
    reset(action: Action) {
      switch (action) {
        case POINT:
          this.location = Point.create(this.center);
          break;
        case ROAD:
          this.location = Line.create();
          break;
        case AREA:
          this.location = Polygon.create();
          break;
      }
      this.geoJson = this.location.geoJson;
      this.editing = true;
    },
  },
});
</script>

<style lang="scss" scoped>
.instructions {
  font-weight: bold;
  margin-bottom: 5px;
}

.editing {
  margin-top: 5px;
}

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
