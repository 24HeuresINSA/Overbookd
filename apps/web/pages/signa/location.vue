<template>
  <DesktopPageTitle />
  <v-container>
    <LocationMap
      :locations="filteredLocations"
      @show:location="openEditLocationDialog"
    />
  </v-container>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="tableHeaders"
        :items="filteredLocations"
        :items-per-page="20"
        :loading="loading"
        loading-text="Chargement des lieux..."
        no-data-text="Aucun lieu trouvé"
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Chercher un lieu"
            hide-details
          />
        </template>

        <template #item.actions="{ item }">
          <v-btn
            v-show="canManageLocations"
            icon="mdi-circle-edit-outline"
            size="small"
            variant="flat"
            @click="openEditLocationDialog(item)"
          />
          <v-btn
            v-show="canManageLocations"
            icon="mdi-trash-can"
            size="small"
            variant="flat"
            @click="openDeleteLocationDialog(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <v-btn
    v-show="canManageLocations"
    color="primary"
    class="btn-plus"
    elevation="2"
    icon="mdi-plus-thick"
    size="large"
    @click="openNewLocationDialog"
  />

  <v-dialog v-model="isNewLocationDialogOpen" max-width="1200">
    <CreateLocationDialogCard @close="closeNewLocationDialog" />
  </v-dialog>

  <v-dialog
    v-model="isEditLocationDialogOpen"
    max-width="1200"
    @update:return-value="closeEditLocationDialog"
  >
    <EditLocationDialogCard
      v-if="locationToEdit"
      :location="locationToEdit"
      @close="closeEditLocationDialog"
    />
  </v-dialog>

  <v-dialog
    v-model="isDeleteLocationDialogOpen"
    max-width="600"
    @update:return-value="closeDeleteLocationDialog"
  >
    <ConfirmationDialogCard
      @confirm="deleteLocation"
      @close="closeDeleteLocationDialog"
    >
      <template #title> Supprimer le lieu </template>
      <template #statement>
        Tu es sur le point de supprimer le lieu
        <strong>{{ locationToDelete ? locationToDelete.name : "" }}.</strong>
        S'il est utilisé à plusieurs endroits, cela pourrait créer des
        problèmes. <br />
        Es-tu sûr de vouloir continuer ?
      </template>
    </ConfirmationDialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { SignaLocation } from "@overbookd/signa";
import { MANAGE_LOCATION } from "@overbookd/permission";
import { SlugifyService } from "@overbookd/slugify";
import {
  type Searchable,
  matchingSearchItems,
} from "~/utils/search/search.utils";
import type { TableHeaders } from "~/utils/data-table/header";

useHead({ title: "Lieux de la signa" });

const userStore = useUserStore();
const locationStore = useLocationStore();

const canManageLocations = computed<boolean>(() =>
  userStore.can(MANAGE_LOCATION),
);
const tableHeaders = computed<TableHeaders>(() => {
  const nameHeader = { title: "Nom", value: "name", sortable: true };
  const actionHeader = { title: "Actions", value: "actions" };
  return canManageLocations.value ? [nameHeader, actionHeader] : [nameHeader];
});

const locations = computed<SignaLocation[]>(() => locationStore.all);
const loading = ref<boolean>(locations.value.length === 0);
locationStore.fetchAllLocations().then(() => (loading.value = false));

const search = ref<string>("");

const searchableLocations = computed<Searchable<SignaLocation>[]>(() => {
  return locations.value.map((location) => ({
    ...location,
    searchable: SlugifyService.apply(location.name),
  }));
});
const filteredLocations = computed<SignaLocation[]>(() => {
  return matchingSearchItems(searchableLocations.value, search.value);
});

const isNewLocationDialogOpen = ref<boolean>(false);
const isEditLocationDialogOpen = ref<boolean>(false);
const isDeleteLocationDialogOpen = ref<boolean>(false);
const locationToEdit = ref<SignaLocation | null>(null);
const locationToDelete = ref<SignaLocation | null>(null);

const openNewLocationDialog = () => (isNewLocationDialogOpen.value = true);
const closeNewLocationDialog = () => (isNewLocationDialogOpen.value = false);

const openEditLocationDialog = (location: SignaLocation) => {
  locationToEdit.value = location;
  isEditLocationDialogOpen.value = true;
};
const closeEditLocationDialog = () => {
  locationToEdit.value = null;
  isEditLocationDialogOpen.value = false;
};

const openDeleteLocationDialog = (location: SignaLocation) => {
  locationToDelete.value = location;
  isDeleteLocationDialogOpen.value = true;
};
const closeDeleteLocationDialog = () => {
  locationToDelete.value = null;
  isDeleteLocationDialogOpen.value = false;
};
const deleteLocation = async () => {
  if (!locationToDelete.value) return;
  await locationStore.deleteLocation(locationToDelete.value);
  closeDeleteLocationDialog();
};
</script>

<style lang="scss" scoped>
.btn-plus {
  right: 20px;
  bottom: 20px;
  position: fixed;
}
</style>
