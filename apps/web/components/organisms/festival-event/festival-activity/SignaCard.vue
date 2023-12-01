<template>
  <div>
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
          @change="updateLocation($event)"
        />

        <h2 class="signage-title">Demande de signalétique</h2>
        <FaSignageTable
          :signages="signa.signages"
          @update="openUpdateSignageDialog"
          @delete="deleteSignage"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="openAddSignageDialog">
          Ajouter une signalétique
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isSignageDialogOpen" max-width="600">
      <FaSignageForm
        @add="addSignage"
        @update="updateSignage"
        @close-dialog="closeAddDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import FaSignageForm from "~/components/molecules/festival-event/logistic/signage/FaSignageForm.vue";
import FaSignageTable from "~/components/molecules/festival-event/logistic/signage/FaSignageTable.vue";
import {
  FestivalActivity,
  Signage,
  Location,
} from "@overbookd/festival-activity";
import { NewSignage } from "~/utils/festival-event/festival-activity.model";

type SignaCardData = {
  isSignageDialogOpen: boolean;
  selectedSignage: Signage | null;
};

export default defineComponent({
  name: "SignaCard",
  components: {
    SearchSignaLocation,
    FaSignageTable,
    FaSignageForm,
  },
  data: (): SignaCardData => ({
    isSignageDialogOpen: false,
    selectedSignage: null as Signage | null,
  }),
  computed: {
    signa(): FestivalActivity["signa"] {
      return this.$accessor.festivalActivity.selectedActivity.signa;
    },
  },
  methods: {
    updateLocation(location: Location) {
      console.log("update location", location);
      // TODO: update location
    },
    openAddSignageDialog() {
      this.isSignageDialogOpen = true;
    },
    closeAddDialog() {
      this.isSignageDialogOpen = false;
    },
    openUpdateSignageDialog(signage: Signage) {
      this.selectedSignage = signage;
      this.isSignageDialogOpen = true;
    },
    closeUpdateDialog() {
      this.isSignageDialogOpen = false;
      this.selectedSignage = null;
    },
    addSignage(signage: NewSignage) {
      console.log("add signage", signage);
      // TODO: add signage
    },
    updateSignage(signage: Signage) {
      console.log("update signage", signage);
      // TODO: update signage
    },
    deleteSignage(signage: Signage) {
      console.log("delete signage", signage);
      // TODO: delete signage
    },
  },
});
</script>

<style lang="scss" scoped>
.signage-title {
  margin: 20px 0;
}
</style>
