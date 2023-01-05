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
                <td>FA</td>
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
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="isFASelectDialogOpen" max-width="500px">
      <FAChooser
        @close-dialog="closeFAChooser"
        @change="setParentFA"
      ></FAChooser>
    </v-dialog>
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
  data: () => ({
    isFASelectDialogOpen: false,
  }),
  computed: {
    mFT() {
      return this.$accessor.FT.mFT;
    },
    locations(): SignaLocation[] {
      return this.$accessor.signaLocation.signaLocations;
    },
    currentLocations(): SignaLocation[] {
      const locationsId = this.$accessor.FT.mFT.locations ?? [];
      return locationsId
        .map((locationId) => {
          return this.$accessor.signaLocation.getLocationById(locationId);
        })
        .filter((location) => location !== undefined) as SignaLocation[];
    },
  },
  methods: {
    selectLocations(locations: string[]) {
      this.$accessor.FT.assignFT({
        details: {
          locations,
        },
      });
    },
    setParentFA(faId: number) {
      this.$accessor.FT.setParentFA(faId);
      this.isFASelectDialogOpen = false;
    },
    unlinkFA() {
      this.$accessor.FT.unlinkFA();
    },
    openFAChooser() {
      this.isFASelectDialogOpen = true;
    },
    closeFAChooser() {
      this.isFASelectDialogOpen = false;
    },
    onChange(key: string, value: any) {
      if (typeof value === "string") value = value.trim();
      this.$accessor.FA.updateFA({ key: key, value: value });
    },
  },
});
</script>
