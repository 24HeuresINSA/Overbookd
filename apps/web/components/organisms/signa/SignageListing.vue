<template>
  <form class="filter">
    <v-text-field
      v-model="searchName"
      append-icon="mdi-hammer-screwdriver"
      label="Nom de la signalisation"
      autofocus
      clearable
      class="filter__field"
      clear-icon="mdi-close-circle-outline"
      counter
    />

    <v-select
      v-model="searchType"
      type="select"
      label="Type de signalisation"
      :items="signageTypeValues"
      class="filter__field"
      clearable
    />

    <div class="create-signa-container">
      <v-btn
        v-if="isCatalogWriter"
        size="large"
        color="success"
        rounded
        prepend-icon="mdi-plus"
        text="Ajouter une signalisation"
        @click="openCreateSignageDialog"
      />
    </div>
  </form>

  <v-data-table
    :headers="tableHeaders"
    :items="filteredSignages"
    :loading="loading"
    items-per-page="20"
    loading-text="Chargement des signalisations..."
    no-data-text="Aucune signalisation trouvée"
  >
    <template #item.image="{ item }">
      <v-icon
        v-if="item.image"
        size="x-large"
        @click="openSignageImageDisplayDialog(item)"
      >
        mdi-image
      </v-icon>
    </template>
    <template #item.actions="{ item }">
      <v-icon
        size="default"
        class="mr-2"
        @click="openUpdateSignageDialog(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon size="default" @click="openDeleteSignageDialog(item)">
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>

  <div style="text-align: center"></div>

  <v-dialog v-model="isCreateOrUpdateSignageDialogOpen" width="600px">
    <SignageForm
      :signage="selectedSignage"
      @close="closeCreateOrUpdateSignageDialog"
    />
  </v-dialog>

  <v-dialog
    v-model="isSignageImageDisplayDialogOpen"
    width="unset"
    height="unset"
  >
    <SignageImageDisplay
      :signage="selectedSignage"
      @close="closeSignageImageDisplayDialog"
    />
  </v-dialog>

  <v-dialog v-model="isDeleteSignageDialogOpen" width="600px">
    <ConfirmationMessage
      confirm-color="error"
      @close="closeDeleteSignageDialog"
      @confirm="deleteSignage"
    >
      <template #title>Suppression de la signalisation</template>
      <template #statement>
        Tu es sur le point de supprimer
        <strong>{{ selectedSignage?.name }}</strong> <br />
        Vérifie 2 fois avant de cliquer car elle sera également supprimée sur
        les FA déjà validées.
      </template>
      <template #confirm-btn-content>
        <v-icon left> mdi-delete </v-icon>Supprimer
      </template>
    </ConfirmationMessage>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { TableHeaders } from "~/utils/data-table/header";
import ConfirmationMessage from "../../atoms/card/ConfirmationMessage.vue";
import { type Signage, type SignageType, signageTypes } from "@overbookd/signa";
import { WRITE_SIGNAGE_CATALOG } from "@overbookd/permission";
import { SlugifyService } from "@overbookd/slugify";
import type { SignageWithPotentialImage } from "~/utils/logistic/signage";

const userStore = useUserStore();
const catalogSignageStore = useCatalogSignageStore();

const signageTypeValues = Object.values(signageTypes);

const searchName = ref<string | null>(null);
const searchType = ref<SignageType | null>(null);
const selectedSignage = ref<SignageWithPotentialImage | undefined>(undefined);
const isCreateOrUpdateSignageDialogOpen = ref<boolean>(false);
const isDeleteSignageDialogOpen = ref<boolean>(false);
const isSignageImageDisplayDialogOpen = ref<boolean>(false);

const isCatalogWriter = computed(() => userStore.can(WRITE_SIGNAGE_CATALOG));
const tableHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Nom", value: "name" },
    { title: "Type", value: "type" },
    { title: "Image", value: "image", sortable: false },
  ];
  const actionHeader = { title: "Actions", value: "actions", sortable: false };
  return [...baseHeaders, ...(isCatalogWriter.value ? [actionHeader] : [])];
});
const signages = computed(() => catalogSignageStore.signages);
const filteredSignages = computed(() =>
  signages.value.filter(
    (signage) =>
      filterSignagesByName(searchName.value)(signage) &&
      filterSignagesByType(searchType.value)(signage),
  ),
);

const loading = ref(signages.value.length === 0);
catalogSignageStore.fetchSignages().then(() => (loading.value = false));

const openCreateSignageDialog = () => {
  selectedSignage.value = undefined;
  isCreateOrUpdateSignageDialogOpen.value = true;
};
const openUpdateSignageDialog = (signage: Signage) => {
  selectedSignage.value = signage;
  isCreateOrUpdateSignageDialogOpen.value = true;
};
const openDeleteSignageDialog = (signage: Signage) => {
  selectedSignage.value = signage;
  isDeleteSignageDialogOpen.value = true;
};
const openSignageImageDisplayDialog = (signage: SignageWithPotentialImage) => {
  selectedSignage.value = signage;
  isSignageImageDisplayDialogOpen.value = true;
};
const closeCreateOrUpdateSignageDialog = () => {
  isCreateOrUpdateSignageDialogOpen.value = false;
  selectedSignage.value = undefined;
};
const closeDeleteSignageDialog = () => {
  isDeleteSignageDialogOpen.value = false;
  selectedSignage.value = undefined;
};
const closeSignageImageDisplayDialog = () => {
  isSignageImageDisplayDialogOpen.value = false;
  selectedSignage.value = undefined;
};
const deleteSignage = async () => {
  if (!selectedSignage.value) return;
  await catalogSignageStore.deleteSignage(selectedSignage.value);
};
const filterSignagesByName = (
  search: string | null,
): ((signage: Signage) => boolean) => {
  if (!search) return () => true;
  const slugifiedSearch = SlugifyService.apply(search);
  return ({ slug }) => slug.includes(slugifiedSearch);
};
const filterSignagesByType = (
  searchType: SignageType | null,
): ((signage: Signage) => boolean) => {
  if (!searchType) return () => true;
  return ({ type }) => (type ? type === searchType : true);
};
</script>

<style lang="scss" scoped>
.filter {
  margin: 1rem 0.5rem;

  display: flex;
  flex-direction: column;
  gap: 2.5%;
  justify-content: center;

  .v-input {
    flex-grow: 1;
  }

  .create-signa-container {
    text-align: center;
  }

  @media only screen and (min-width: $mobile-max-width) {
    flex-direction: row;
    &__field {
      width: 50%;
    }
    .create-signa-container {
      margin-top: 5px;
    }
  }
}
</style>
