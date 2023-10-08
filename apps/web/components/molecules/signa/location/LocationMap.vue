<template>
  <section class="map-section">
    <div class="map-container">
      <client-only>
        <l-map
          id="LocationMap"
          :zoom="zoom"
          :center="center"
          :options="{ name: 'LocationMap' }"
          @click="userAction"
          @mousemove="userHover"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker
            v-for="(latlng, index) in pointList"
            :key="index"
            :lat-lng="latlng"
          >
            <l-tooltip>Hello!</l-tooltip>
          </l-marker>
          <l-polyline
            v-for="(line, index) in lineList"
            :key="index"
            :lat-lngs="line"
          >
            <l-tooltip>Hello!</l-tooltip>
          </l-polyline>
          <l-polygon
            v-for="(polygon, index) in polygonList"
            :key="index"
            :lat-lngs="polygon"
          >
            <l-tooltip>Hello!</l-tooltip>
          </l-polygon>
        </l-map>
      </client-only>
    </div>
    <v-select v-model="action" :items="actions"></v-select>
    <v-btn :disabled="!actionInProcess" @click="finishAction">
      Finir l'edition
    </v-btn>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LocationMap",
  data: () => ({
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 16,
    center: [45.784045, 4.876916],
    action: "Point",
    actions: ["Point", "Ligne", "Zone"],
    points: [[45.784045, 4.876916]] as number[][],
    lines: [] as number[][][],
    polygons: [] as number[][][],
    actionInProcess: null as null | string,
    mouseLatlng: null as null | number[],
  }),
  methods: {
    userHover({ latlng }: { latlng: number[] }) {
      this.mouseLatlng = latlng;
    },
    userAction({ latlng }: { latlng: number[] }) {
      switch (this.action) {
        case "Point":
          this.addMarker(latlng);
          break;
        case "Ligne":
          this.addLinePoint(latlng);
          break;
        case "Zone":
          this.addPolygonPoint(latlng);
          break;
      }
    },
    addMarker(latlng: number[]) {
      this.points.push(latlng);
    },
    addLinePoint(latlng: number[]) {
      if (this.actionInProcess) {
        this.lines[this.lines.length - 1].push(latlng);
      } else {
        this.lines.push([latlng]);
        this.actionInProcess = "Ligne";
      }
    },
    addPolygonPoint(latlng: number[]) {
      if (this.actionInProcess) {
        this.polygons[this.polygons.length - 1].push(latlng);
      } else {
        this.polygons.push([latlng]);
        this.actionInProcess = "Zone";
      }
    },
    finishAction() {
      this.actionInProcess = null;
    },
  },
  computed: {
    pointList(): number[][] {
      if (this.action === "Point" && this.mouseLatlng) {
        return [...this.points, this.mouseLatlng];
      }
      return this.points;
    },
    lineList(): number[][][] {
      if (this.action === "Ligne" && this.actionInProcess && this.mouseLatlng) {
        const lastLine = this.lines[this.lines.length - 1];
        const otherLines = this.lines.slice(0, this.lines.length - 1);
        return [...otherLines, [...lastLine, this.mouseLatlng]];
      }
      return this.lines;
    },
    polygonList(): number[][][] {
      if (this.action === "Zone" && this.actionInProcess && this.mouseLatlng) {
        const lastPolygon = this.polygons[this.polygons.length - 1];
        const otherPolygons = this.polygons.slice(0, this.polygons.length - 1);
        return [...otherPolygons, [...lastPolygon, this.mouseLatlng]];
      }
      return this.polygons;
    },
  },
});
</script>

<style lang="scss" scoped>
.map-container {
  position: relative;
  z-index: 1;
  height: 40vh;
}
</style>
