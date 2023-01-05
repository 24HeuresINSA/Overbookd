<template>
  <div>
    <v-card>
      <v-card-title>Info</v-card-title>
      <v-card-text>
        <v-autocomplete
          label="Lieux"
          :value="currentLocations"
          :items="locations"
          item-text="name"
          item-value="id"
          multiple
          @change="onChange('locations', $event)"
        ></v-autocomplete>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Valeurs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><a v-if="mFT.fa" :href="`/fa/${mFT.fa}`">Nom FA</a></td>
                <td>
                  <a v-if="mFT.fa" :href="`/fa/${mFT.fa}`">{{ mFT.fa }}</a>
                  <v-btn :href="`/fa/${mFT.fa}`" icon small>
                    <v-icon small>mdi-link</v-icon>
                  </v-btn>
                </td>
                <td>
                  <v-btn small text @click="openFAChooser"
                    >Choisir une FA parente</v-btn
                  >
                  <v-btn small text :disabled="!mFT.fa" @click="unlinkFA"
                    >Détacher la FA</v-btn
                  >
                </td>
              </tr>
              <tr>
                <td>Nombre de matos</td>
                <td>{{ mFT.equipments.length }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <FAChooser ref="FAChooser"></FAChooser>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FAChooser from "~/components/molecules/FAChooser.vue";
import { SignaLocation } from "~/utils/models/signaLocation";

export default Vue.extend({
  name: "FTInfoCard",
  components: {
    FAChooser,
  },
  computed: {
    mFT() {
      return this.$accessor.FT.mFT;
    },
    currentLocations(): SignaLocation[] {
      const locationsId = this.$accessor.FT.mFT.locations ?? [];
      return locationsId
        .map((locationId) => {
          return this.$accessor.signaLocation.getLocationById(locationId);
        })
        .filter((location) => location !== undefined) as SignaLocation[];
    },
    locations(): SignaLocation[] {
      return this.$accessor.signaLocation.signaLocations;
    },
  },
  methods: {
    selectLocations(locations: string[]): void {
      this.$accessor.FT.assignFT({
        details: {
          locations,
        },
      });
    },
    unlinkFA(): void {
      this.$accessor.FT.unlinkFA();
    },
    openFAChooser(): void {
      (this.$refs.FAChooser as any).openDialog();
    },
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
  },
});
</script>
