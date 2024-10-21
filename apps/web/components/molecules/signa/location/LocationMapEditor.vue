<template>
  <section class="map-section">
    <p class="instructions">
      Pour activer et désactiver la modification sur la carte tu peux utiliser
      le clic droit.
    </p>
    <v-switch
      v-model="editing"
      class="editing"
      color="primary"
      label="Mode édition"
      inset
      hide-details
    />
    <v-lazy>
      <div class="map">
        <l-map
          id="location-map-editor"
          :zoom="zoom"
          :center="center"
          :use-global-leaflet="false"
          @click="userAction"
          @contextmenu="switchEditing"
          @mousemove="userHover"
          @update:zoom="updateZoom"
        >
          <l-tile-layer :url="url" :attribution="attribution" />
          <l-marker v-if="isPointEdition" :lat-lng="coordinates" />
          <l-polyline v-if="isRoadEdition" :lat-lngs="coordinates" />
          <l-polygon v-if="isAreaEdition" :lat-lngs="coordinates" />
        </l-map>
      </div>
    </v-lazy>
    <div class="editor-container">
      <div>
        <v-select
          v-model="action"
          label="Type de forme"
          :items="actions"
          item-title="value"
          item-value="key"
          density="comfortable"
          class="mt-2"
          hide-details
        />
      </div>
      <v-btn text="Réinitialiser" @click="reset(action)" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import {
  type GeoLocation,
  type Coordinate,
  POINT,
  ROAD,
  AREA,
  Line,
  Point,
  Polygon,
  type ManageLocation,
  LocationFactory,
} from "@overbookd/geo-location";
import { isPointLocation } from "@overbookd/signa";
import { defaultMapConfiguration } from "~/utils/map.config";

type Action = typeof POINT | typeof ROAD | typeof AREA;
type ActionItem = {
  key: Action;
  value: string;
};

const actions: ActionItem[] = [
  { key: POINT, value: "Point" },
  { key: ROAD, value: "Route" },
  { key: AREA, value: "Zone" },
];

const geoLocation = defineModel<GeoLocation | null>({ required: true });

const editing = ref<boolean>(geoLocation.value === null);
const mouseLatlng = ref<Coordinate>(defaultMapConfiguration.center);
const manage = ref<ManageLocation>(
  Point.create(defaultMapConfiguration.center),
);
const zoom = ref<number>(defaultMapConfiguration.zoom);
const center = ref<Coordinate>(defaultMapConfiguration.center);
const url = ref<string>(defaultMapConfiguration.url);
const attribution = ref<string>(defaultMapConfiguration.attribution);

const action = computed<Action>({
  get: () => geoLocation.value?.type ?? POINT,
  set: (action: Action) => reset(action),
});

const isPointEdition = computed<boolean>(() => action.value === POINT);
const isRoadEdition = computed<boolean>(() => action.value === ROAD);
const isAreaEdition = computed<boolean>(() => action.value === AREA);

const coordinates = computed<Coordinate | Coordinate[]>(() => {
  if (!geoLocation.value) return defaultMapConfiguration.center;
  return isPointLocation(geoLocation.value) || !editing.value
    ? geoLocation.value.coordinates
    : [...geoLocation.value.coordinates, mouseLatlng.value];
});

watch(
  () => geoLocation.value,
  (newGeoLocation) => {
    if (!newGeoLocation) {
      manage.value = Point.create(center.value);
      return;
    }
    manage.value = LocationFactory.create(newGeoLocation);
  },
  { immediate: true },
);

const switchEditing = () => (editing.value = !editing.value);
const updateZoom = (newZoom: number) => (zoom.value = newZoom);
const userHover = ({ latlng }: { latlng: Coordinate }) => {
  mouseLatlng.value = latlng;
};

const userAction = ({ latlng }: { latlng: Coordinate }) => {
  if (!editing.value) return;
  manage.value.addCoordinate(latlng);
  geoLocation.value = manage.value.location;
};

const reset = (newAction: Action) => {
  switch (newAction) {
    case POINT:
      manage.value = Point.create(center.value);
      break;
    case ROAD:
      manage.value = Line.create();
      break;
    case AREA:
      manage.value = Polygon.create();
      break;
  }
  geoLocation.value = manage.value.location;
  editing.value = true;
};
</script>

<style scoped>
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
