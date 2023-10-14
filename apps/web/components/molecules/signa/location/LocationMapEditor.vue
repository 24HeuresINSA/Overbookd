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
import { MapObjectType, LatLng } from "~/utils/models/signa-location.model";

export default defineComponent({
  name: "LocationMapEditor",
  props: {
    value: {
      type: Object as () => MapObjectType | null,
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
    mouseLatlng: null as null | LatLng,
  }),
  computed: {
    selection: {
      get(): null | MapObjectType {
        return this.value;
      },
      set(selection: null | MapObjectType) {
        this.$emit("input", selection);
      },
    },
    point(): null | LatLng {
      if (this.selection && this.selection.type === "POINT") {
        return this.selection.coordinates?.[0] ?? null;
      }
      return null;
    },
    line(): null | LatLng[] {
      if (this.selection && this.selection.type === "ROAD") {
        if (!this.editionDone && this.action === "Ligne" && this.mouseLatlng) {
          return [...this.selection.coordinates, this.mouseLatlng];
        }
        return this.selection.coordinates;
      }
      return null;
    },
    polygon(): null | LatLng[] {
      if (this.selection && this.selection.type === "AREA") {
        if (!this.editionDone && this.action === "Zone" && this.mouseLatlng) {
          return [...this.selection.coordinates, this.mouseLatlng];
        }
        return this.selection.coordinates;
      }
      return null;
    },
  },
  methods: {
    userHover({ latlng }: { latlng: LatLng }) {
      this.mouseLatlng = latlng;
    },
    userAction({ latlng }: { latlng: LatLng }) {
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
    setPoint(latlng: LatLng) {
      if (this.line || this.polygon) return;
      this.selection = {
        type: "POINT",
        coordinates: [latlng],
      };
    },
    addLinePoint(latlng: LatLng) {
      if (this.point || this.polygon) return;
      if (this.selection && this.selection.type === "ROAD") {
        this.selection.coordinates = [
          ...this.selection.coordinates,
          latlng,
        ] as LatLng[];
      } else {
        this.selection = {
          type: "ROAD",
          coordinates: [latlng],
        };
      }
    },
    addPolygonPoint(latlng: LatLng) {
      if (this.point || this.line) return;
      if (this.selection && this.selection.type === "AREA") {
        this.selection.coordinates = [
          ...this.selection.coordinates,
          latlng,
        ] as LatLng[];
      } else {
        this.selection = {
          type: "AREA",
          coordinates: [latlng],
        };
      }
    },
    finishAction() {
      this.editionDone = true;
    },
    reset() {
      this.selection = null;
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
