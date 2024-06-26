<template>
  <div>
    <h1>Lieux de la Signa</h1>
    <v-container>
      <LocationMap
        :locations="locations"
        @show:location="editLocationDialog"
      ></LocationMap>
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
              <v-btn
                v-show="canManageLocations"
                icon
                small
                @click="editLocationDialog(item)"
              >
                <v-icon small>mdi-circle-edit-outline</v-icon>
              </v-btn>
              <v-btn
                v-show="canManageLocations"
                icon
                small
                @click="deleteLocationDialog(item)"
              >
                <v-icon small>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>

    <v-btn
      v-show="canManageLocations"
      color="secondary"
      class="btn-plus"
      elevation="2"
      fab
      @click="displayNewLocationDialog = true"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="displayNewLocationDialog" max-width="1200">
      <NewLocationCard @creation-done="closeCreationDialog" />
    </v-dialog>

    <v-dialog
      v-model="displayEditLocationDialog"
      max-width="1200"
      @update:return-value="closeEditionDialog"
    >
      <EditLocationCard
        v-if="locationToEdit"
        :location="locationToEdit"
        @edition-done="closeEditionDialog"
      />
    </v-dialog>

    <v-dialog
      v-model="displayDeleteLocationDialog"
      max-width="600"
      @update:return-value="closeDeletionDialog"
    >
      <ConfirmationMessage
        @close-dialog="closeDeletionDialog"
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
import { Header } from "~/utils/data-table/header";
import { SignaLocation } from "@overbookd/signa";
import LocationMap from "~/components/molecules/signa/location/LocationMap.vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import NewLocationCard from "~/components/molecules/signa/location/NewLocationCard.vue";
import EditLocationCard from "~/components/molecules/signa/location/EditLocationCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { MANAGE_LOCATION } from "@overbookd/permission";

type LocationData = {
  headers: Header[];
  search: string;
  displayNewLocationDialog: boolean;
  locationToEdit: SignaLocation | null;
  locationToDelete: SignaLocation | null;
  displayEditLocationDialog: boolean;
  displayDeleteLocationDialog: boolean;
};

export default Vue.extend({
  name: "Location",
  components: {
    LocationMap,
    NewLocationCard,
    EditLocationCard,
    ConfirmationMessage,
    SnackNotificationContainer,
  },
  data: (): LocationData => ({
    headers: [
      { text: "Nom", value: "name" },
      { text: "Action", value: "action", sortable: false },
    ],
    search: "",
    displayNewLocationDialog: false,
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
    canManageLocations(): boolean {
      return this.$accessor.user.can(MANAGE_LOCATION);
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
    closeCreationDialog() {
      this.displayNewLocationDialog = false;
    },
    closeEditionDialog() {
      this.locationToEdit = null;
      this.displayEditLocationDialog = false;
    },
    closeDeletionDialog() {
      this.locationToDelete = null;
      this.displayDeleteLocationDialog = false;
    },
    async deleteLocation() {
      if (!this.locationToDelete) return;

      await this.$accessor.signa.deleteLocation(this.locationToDelete);
      this.closeDeletionDialog();
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
