<template>
  <div>
    <h1>Lieux de la Signa</h1>
    <v-container>
      <LocationMap></LocationMap>
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
              <v-btn icon small @click="locationToEdit = item">
                <v-icon small>mdi-circle-edit-outline</v-icon>
              </v-btn>
              <v-btn icon small @click="locationToDelete = item">
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

    <v-dialog v-model="isNewLocationDialogOpen" max-width="600">
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
import { SignaLocation, Location } from "~/utils/models/signa-location.model";
import LocationMap from "~/components/molecules/signa/location/LocationMap.vue";
import ConfirmationMessage from "~/components/atoms/card/ConfirmationMessage.vue";
import NewLocationCard from "~/components/molecules/signa/location/NewLocationCard.vue";
import ModifyLocationCard from "~/components/molecules/signa/location/ModifyLocationCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";

interface LocationData {
  headers: Header[];
  search: string;
  isNewLocationDialogOpen: boolean;
  locationToEdit: Location | null;
  locationToDelete: Location | null;
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
  }),
  head: () => ({
    title: "Lieux de la signa",
  }),
  computed: {
    locations(): SignaLocation[] {
      return this.$accessor.signa.locations;
    },
    displayEditLocationDialog(): boolean {
      return this.locationToEdit !== null;
    },
    displayDeleteLocationDialog(): boolean {
      return this.locationToDelete !== null;
    },
  },
  async mounted() {
    this.$accessor.signa.getAllSignaLocations();
  },
  methods: {
    closeAllDialogs() {
      this.isNewLocationDialogOpen = false;
      this.locationToEdit = null;
      this.locationToDelete = null;
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
