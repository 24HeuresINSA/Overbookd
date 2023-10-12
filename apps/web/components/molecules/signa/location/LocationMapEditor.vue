<template>
  <section class="map-section">
    <v-lazy>
      <client-only>
        <div class="map">
          <l-map
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

type Selection = {
  type: "POINT" | "ROAD" | "AREA";
  coordinates: number[] | number[][];
};

export default defineComponent({
  name: "LocationMapEditor",
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 16,
    center: [45.784045, 4.876916],
    action: "Point",
    actions: ["Point", "Ligne", "Zone"],
    editionDone: false,
    mouseLatlng: null as null | number[],
    selection: null as null | Selection,
  }),
  computed: {
    point(): null | number[] {
      if (this.selection && this.selection.type === "POINT") {
        return this.selection.coordinates as number[];
      }
      return null;
    },
    line(): null | number[][] {
      if (this.selection && this.selection.type === "ROAD") {
        if (!this.editionDone && this.action === "Ligne" && this.mouseLatlng) {
          const lastLine = this.selection.coordinates as number[][];
          return [...lastLine, this.mouseLatlng];
        }
        return this.selection.coordinates as number[][];
      }
      return null;
    },
    polygon(): null | number[][] {
      if (this.selection && this.selection.type === "AREA") {
        if (!this.editionDone && this.action === "Zone" && this.mouseLatlng) {
          const lastPolygon = this.selection.coordinates as number[][];
          return [...lastPolygon, this.mouseLatlng];
        }
        return this.selection.coordinates as number[][];
      }
      return null;
    },
  },
  methods: {
    userHover({ latlng }: { latlng: number[] }) {
      this.mouseLatlng = latlng;
    },
    userAction({ latlng }: { latlng: number[] }) {
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
    setPoint(latlng: number[]) {
      if (this.line || this.polygon) return;
      this.selection = {
        type: "POINT",
        coordinates: latlng,
      };
    },
    addLinePoint(latlng: number[]) {
      if (this.point || this.polygon) return;
      if (this.selection && this.selection.type === "ROAD") {
        this.selection.coordinates = [...this.selection.coordinates, latlng] as number[][];
      } else {
        this.selection = {
          type: "ROAD",
          coordinates: [latlng],
        };
      }
    },
    addPolygonPoint(latlng: number[]) {
      if (this.point || this.line) return;
      if (this.selection && this.selection.type === "AREA") {
        this.selection.coordinates = [...this.selection.coordinates, latlng] as number[][];
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

.editor-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor-container > * {
  width: 30%;
}
</style>
