<template>
  <div>
    <h1>Lieux de la Signa</h1>
    <v-container>
      <LocationMap :locations="locations"></LocationMap>
    </v-container>
    <v-container class="location-table">
      <v-data-table
        :headers="headers"
        :items="locations"
        :search="search"
        :footer-props="{ 'items-per-page-options': [20, 100, -1] }"
        class="elevation-1"
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Chercher"
            class="mx-4"
          ></v-text-field>
        </template>

        <template #item.action="{ item }">
          <tr>
            <td>
              <v-btn icon small @click="editLocationDialog(item)">
                <v-icon small>mdi-circle-edit-outline</v-icon>
              </v-btn>
              <v-btn icon small @click="deleteLocationDialog(item)">
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>

    <v-btn
      color="secondary"
      class="btn-plus"
      elevation="2"
      fab
      @click="isNewLocationDialogOpen = true"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="isNewLocationDialogOpen" max-width="1200">
      <NewLocationCard @close-dialog="closeAllDialogs" />
    </v-dialog>

    <v-dialog v-model="displayEditLocationDialog" max-width="600">
      <ModifyLocationCard
        v-if="locationToEdit"
        :location="locationToEdit"
        @close-dialog="closeAllDialogs"
      />
    </v-dialog>

    <v-dialog v-model="displayDeleteLocationDialog" max-width="600">
      <ConfirmationMessage
        @close-dialog="closeAllDialogs"
        @confirm="deleteLocation"
      >
        <template #title>
          Supprimer le lieu {{ locationToDelete ? locationToDelete.name : "" }}
        </template>
      </ConfirmationMessage>
    </v-dialog>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/data-table.model";
import { SignaLocation } from "@overbookd/signa";
import LocationMap from "~/components/molecules/signa/location/LocationMap.vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import NewLocationCard from "~/components/molecules/signa/location/NewLocationCard.vue";
import ModifyLocationCard from "~/components/molecules/signa/location/ModifyLocationCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

interface LocationData {
  headers: Header[];
  search: string;
  isNewLocationDialogOpen: boolean;
  locationToEdit: SignaLocation | null;
  locationToDelete: SignaLocation | null;
  displayEditLocationDialog: boolean;
  displayDeleteLocationDialog: boolean;
}

export default Vue.extend({
  name: "Location",
  components: {
    LocationMap,
    NewLocationCard,
    ModifyLocationCard,
    ConfirmationMessage,
    SnackNotificationContainer,
  },
  data: (): LocationData => ({
    headers: [
      { text: "Nom", value: "name" },
      { text: "Action", value: "action", sortable: false },
    ],
    search: "",
    isNewLocationDialogOpen: false,
    locationToEdit: null,
    locationToDelete: null,
    displayEditLocationDialog: false,
    displayDeleteLocationDialog: false,
  }),
  head: () => ({
    title: "Lieux de la signa",
  }),
  computed: {
    locations(): SignaLocation[] {
      return this.$accessor.signa.locations;
    },
  },
  watch: {
    displayEditLocationDialog(val: boolean) {
      if (val) return;
      this.closeAllDialogs();
    },
    displayDeleteLocationDialog(val: boolean) {
      if (val) return;
      this.closeAllDialogs();
    },
  },
  async mounted() {
    this.$accessor.signa.getAllSignaLocations();
  },
  methods: {
    editLocationDialog(location: SignaLocation) {
      this.locationToEdit = location;
      this.displayEditLocationDialog = true;
    },
    deleteLocationDialog(location: SignaLocation) {
      this.locationToDelete = location;
      this.displayDeleteLocationDialog = true;
    },
    closeAllDialogs() {
      this.isNewLocationDialogOpen = false;
      this.locationToEdit = null;
      this.locationToDelete = null;
      this.displayEditLocationDialog = false;
      this.displayDeleteLocationDialog = false;
    },
    async deleteLocation() {
      if (!this.locationToDelete) return;

      await this.$accessor.signa.deleteLocation(this.locationToDelete);
      this.closeAllDialogs();
    },
  },
});
</script>

<style lang="scss" scoped>
.btn-plus {
  right: 20px;
  bottom: 45px;
  position: fixed;
}
</style>
