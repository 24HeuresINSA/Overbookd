<template>
  <v-card>
    <v-card-title> Signa </v-card-title>
    <v-card-subtitle>
      Contacte la signa via
      <a href="mailto:signaletique@24heures.org">signaletique@24heures.org</a>
      pour ajouter des lieux non existants dans la liste déroulante.
    </v-card-subtitle>

    <v-card-text>
      <SearchSignaLocation
        :location="signa.location"
        label="Lieu"
        :boxed="false"
        @change="updateLocation"
      />

      <h2 class="signage-title">Demande de signalétique</h2>
      <FaSignageTable
        :signages="signa.signages"
        @add="addSignage"
        @update="updateSignage"
        @remove="removeSignage"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import FaSignageTable from "~/components/molecules/festival-event/logistic/signage/FaSignageTable.vue";
import {
  FestivalActivity,
  Signage,
  Location,
  PrepareSignageCreation,
} from "@overbookd/festival-activity";

export default defineComponent({
  name: "SignaCard",
  components: {
    SearchSignaLocation,
    FaSignageTable,
  },
  computed: {
    signa(): FestivalActivity["signa"] {
      return this.$accessor.festivalActivity.selectedActivity.signa;
    },
  },
  methods: {
    updateLocation(location: Location | null) {
      const locationId = location?.id ?? null;
      this.$accessor.festivalActivity.updateSigna({ locationId });
    },
    addSignage(signage: PrepareSignageCreation) {
      this.$accessor.festivalActivity.addSignage(signage);
    },
    updateSignage(signage: Signage) {
      this.$accessor.festivalActivity.updateSignage(signage);
    },
    removeSignage(signage: Signage) {
      this.$accessor.festivalActivity.removeSignage(signage.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.signage-title {
  margin: 20px 0;
}
</style>
