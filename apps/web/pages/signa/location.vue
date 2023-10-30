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
      @click="displayNewLocationDialog = true"
    >
      <v-icon> mdi-plus-thick</v-icon>
    </v-btn>

    <v-dialog v-model="displayNewLocationDialog" max-width="1200">
      <NewLocationCard @close-dialog="closeAllDialogs" />
    </v-dialog>

    <v-dialog
      v-model="displayEditLocationDialog"
      max-width="1200"
      @update:return-value="closeAllDialogs"
    >
      <EditLocationCard
        v-if="locationToEdit"
        :location="locationToEdit"
        @close-dialog="closeAllDialogs"
      />
    </v-dialog>

    <v-dialog
      v-model="displayDeleteLocationDialog"
      max-width="600"
      @update:return-value="closeAllDialogs"
    >
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
import EditLocationCard from "~/components/molecules/signa/location/EditLocationCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

interface LocationData {
  headers: Header[];
  search: string;
  displayNewLocationDialog: boolean;
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
      this.locationToEdit = null;
      this.locationToDelete = null;
      this.displayNewLocationDialog = false;
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
