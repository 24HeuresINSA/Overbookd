<template>
  <section class="map-section">
    <div class="map">
      <client-only>
        <l-map
          id="LocationMapEditor"
          :zoom="zoom"
          :center="center"
          :options="{ name: 'LocationMapEditor' }"
          @click="userAction"
          @mousemove="userHover"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-marker v-if="point" :lat-lng="point"> </l-marker>
          <l-polyline v-if="line" :lat-lngs="line"> </l-polyline>
          <l-polygon v-if="polygon" :lat-lngs="polygon"> </l-polygon>
        </l-map>
      </client-only>
    </div>
    <div class="editor-container">
      <div><v-select v-model="action" :items="actions"></v-select></div>
      <v-btn :disabled="!actionInProcess" @click="finishAction">
        Finir l'edition
      </v-btn>
      <v-btn @click="reset"> Réinitialiser </v-btn>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
    point: null as null | number[],
    line: null as null | number[][],
    polygon: null as null | number[][],
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
      if (this.line || this.polygon) return;
      this.point = latlng;
    },
    addLinePoint(latlng: number[]) {
      if (this.point || this.polygon) return;
      if (this.line) {
        this.line.push(latlng);
      } else {
        this.line = [latlng];
      }
    },
    addPolygonPoint(latlng: number[]) {
      if (this.point || this.line) return;
      if (this.polygon) {
        this.polygon.push(latlng);
      } else {
        this.polygon = [latlng];
      }
    },
    finishAction() {
      this.actionInProcess = null;
    },
    reset() {
      this.point = null;
      this.line = null;
      this.polygon = null;
      this.actionInProcess = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.map {
  height: 40vh;
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
