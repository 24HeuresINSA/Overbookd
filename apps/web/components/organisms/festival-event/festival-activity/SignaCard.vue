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
          :location="currentLocation"
          label="Lieu"
          :boxed="false"
          @change="updateLocation($event)"
        />

        <v-card-title> Demande de signalétique </v-card-title>
        <FaSignageTable
          :signages="signages"
          @update="openEditDialog"
          @delete="deleteSignage"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="openAddDialog"> Ajouter </v-btn>
      </v-card-actions>
    </v-card>

    <v-dialog v-model="isAddDialogOpen" max-width="600">
      <SignaNeedForm @change="addSignage" @close-dialog="closeAddDialog" />
    </v-dialog>

    <v-dialog v-model="isEditDialogOpen" max-width="600">
      <SignaNeedForm
        :signa-need="selectedSignage"
        @change="updateSignage"
        @close-dialog="closeEditDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchSignaLocation from "~/components/atoms/field/search/SearchSignaLocation.vue";
import SignaNeedForm from "~/components/molecules/festival-event/logistic/signaNeed/SignaNeedForm.vue";
import FaSignageTable from "~/components/molecules/festival-event/logistic/signaNeed/FaSignageTable.vue";
import {
  FestivalActivity,
  Signage,
  Location,
} from "@overbookd/festival-activity";

type SignaCardData = {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  selectedSignage: Signage | null;
};

export default defineComponent({
  name: "SignaCard",
  components: {
    SearchSignaLocation,
    FaSignageTable,
    SignaNeedForm,
  },
  data: (): SignaCardData => ({
    isAddDialogOpen: false,
    isEditDialogOpen: false,
    selectedSignage: null as Signage | null,
  }),
  computed: {
    signa(): FestivalActivity["signa"] {
      return this.$accessor.festivalActivity.selectedActivity.signa;
    },
    signages(): Signage[] {
      return this.signa.signages;
    },
    currentLocation(): Location | null {
      return this.signa.location;
    },
  },
  methods: {
    updateLocation(location: Location | null) {
      const locationId = location?.id ?? null;
      this.$accessor.festivalActivity.updateSigna({ locationId });
    },
    openAddDialog() {
      this.isAddDialogOpen = true;
    },
    closeAddDialog() {
      this.isAddDialogOpen = false;
    },
    openEditDialog(signage: Signage) {
      this.selectedSignage = signage;
      this.isEditDialogOpen = true;
    },
    closeEditDialog() {
      this.isEditDialogOpen = false;
      this.selectedSignage = null;
    },
    addSignage(signage: Signage) {
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
