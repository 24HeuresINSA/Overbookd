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
  GeoLocation,
  Coordinate,
  POINT,
  ROAD,
  AREA,
  Line,
  Point,
  Polygon,
  ManageLocation,
  LocationFactory,
} from "@overbookd/geo-location";
import { isPointLocation } from "@overbookd/signa";
import { mapConfiguration } from "~/utils/location/map";

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
  manage: ManageLocation;
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
    event: "update:geo-location",
  },
  props: {
    value: {
      type: Object as () => GeoLocation | null,
      required: true,
    },
  },
  emits: ["update:geo-location"],
  data: (): LocationMapEditorData => ({
    ...mapConfiguration,
    actions,
    editing: false,
    mouseLatlng: mapConfiguration.center,
    manage: Point.create(mapConfiguration.center),
  }),
  computed: {
    geoLocation: {
      get(): GeoLocation | null {
        return this.value;
      },
      set(geoLocation: GeoLocation) {
        this.$emit("update:geo-location", geoLocation);
        this.setManage(geoLocation);
      },
    },
    action: {
      get(): Action {
        return this.geoLocation?.type ?? POINT;
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
      if (isPointLocation(this.geoLocation)) return false;

      return this.editing;
    },
    coordinates(): Coordinate | Coordinate[] {
      if (!this.geoLocation) return mapConfiguration.center;

      return isPointLocation(this.geoLocation) || !this.editing
        ? this.geoLocation.coordinates
        : [...this.geoLocation.coordinates, this.mouseLatlng];
    },
  },
  mounted() {
    this.setManage(this.geoLocation);
    this.initEditing();
  },
  methods: {
    initEditing() {
      this.editing = this.geoLocation === null;
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
      this.manage.addCoordinate(latlng);
      this.geoLocation = this.manage.location;
    },
    setManage(geoLocation: GeoLocation | null) {
      if (!geoLocation) {
        this.manage = Point.create(this.center);
        return;
      }
      this.manage = LocationFactory.create(geoLocation);
    },
    reset(action: Action) {
      switch (action) {
        case POINT:
          this.manage = Point.create(this.center);
          break;
        case ROAD:
          this.manage = Line.create();
          break;
        case AREA:
          this.manage = Polygon.create();
          break;
      }
      this.geoLocation = this.manage.location;
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
