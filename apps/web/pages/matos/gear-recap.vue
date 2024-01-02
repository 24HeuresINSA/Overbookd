<template>
  <div>
    <h1>Récap Matos</h1>
    <v-expansion-panels>
      <v-expansion-panel v-for="gear in gears" :key="gear.slug">
        <v-expansion-panel-header>
          {{ gear.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          Contenu à définir
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Gear } from "~/utils/models/catalog.model";

export default defineComponent({
  name: "GearRecap",
  head: () => ({
    title: "Récap Matos",
  }),
  computed: {
    gears(): Gear[] {
      return this.$accessor.catalogGear.gears;
    },
  },
  mounted() {
    this.$accessor.catalogGear.fetchGears({});
  },
});
</script>
