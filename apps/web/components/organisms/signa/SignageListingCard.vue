<template>
  <v-card>
    <v-card-text>
      <div class="filters">
        <v-text-field
          v-model="searchName"
          label="Nom de la signalisation"
          class="filter__field"
          clear-icon="mdi-close-circle-outline"
          autofocus
          clearable
          hide-details
        />

        <v-select
          v-model="searchType"
          type="select"
          label="Type de signalisation"
          :items="signageTypeValues"
          class="filter__field"
          clearable
          hide-details
        />

        <div class="create-signa-container">
          <v-btn
            v-if="isCatalogWriter"
            text="Ajouter une signalisation"
            prepend-icon="mdi-plus"
            size="large"
            color="primary"
            rounded
            @click="openCreateSignageDialog"
          />
        </div>
      </div>

      <v-data-table
        :headers="tableHeaders"
        :items="filteredSignages"
        :loading="loading"
        loading-text="Chargement des signalisations..."
        no-data-text="Aucune signalisation trouvée"
        :mobile="isMobile"
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
          <v-btn
            icon="mdi-pencil"
            size="small"
            variant="flat"
            @click="openUpdateSignageDialog(item)"
          />
          <v-btn
            icon="mdi-trash-can"
            size="small"
            variant="flat"
            @click="openDeleteSignageDialog(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <v-dialog v-model="isCreateOrUpdateSignageDialogOpen" width="600px">
    <SignageFormDialogCard
      :signage="selectedSignage"
      @close="closeCreateOrUpdateSignageDialog"
    />
  </v-dialog>

  <v-dialog
    v-model="isSignageImageDisplayDialogOpen"
    width="unset"
    height="unset"
  >
    <SignageImageDisplayDialogCard
      :signage="selectedSignage"
      @close="closeSignageImageDisplayDialog"
    />
  </v-dialog>

  <v-dialog v-model="isDeleteSignageDialogOpen" width="600px">
    <ConfirmationDialogCard
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
        <v-icon left> mdi-trash-can </v-icon>Supprimer
      </template>
    </ConfirmationDialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { type Signage, type SignageType, signageTypes } from "@overbookd/signa";
import { WRITE_SIGNAGE_CATALOG } from "@overbookd/permission";
import { SlugifyService } from "@overbookd/slugify";
import type { SignageWithPotentialImage } from "~/utils/logistic/signage";

const userStore = useUserStore();
const catalogSignageStore = useCatalogSignageStore();
const layoutStore = useLayoutStore();

const signageTypeValues = Object.values(signageTypes);

const searchName = ref<string | null>(null);
const searchType = ref<SignageType | null>(null);
const selectedSignage = ref<SignageWithPotentialImage | undefined>(undefined);
const isCreateOrUpdateSignageDialogOpen = ref<boolean>(false);
const isDeleteSignageDialogOpen = ref<boolean>(false);
const isSignageImageDisplayDialogOpen = ref<boolean>(false);

const isCatalogWriter = computed<boolean>(() =>
  userStore.can(WRITE_SIGNAGE_CATALOG),
);
const tableHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Nom", value: "name", sortable: true },
    { title: "Type", value: "type", sortable: true },
    { title: "Image", value: "image" },
  ];
  const actionHeader = { title: "Actions", value: "actions" };
  return [...baseHeaders, ...(isCatalogWriter.value ? [actionHeader] : [])];
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const signages = computed<SignageWithPotentialImage[]>(
  () => catalogSignageStore.signages,
);
const filteredSignages = computed<SignageWithPotentialImage[]>(() =>
  signages.value.filter(
    (signage) =>
      filterSignagesByName(searchName.value)(signage) &&
      filterSignagesByType(searchType.value)(signage),
  ),
);

const loading = ref<boolean>(signages.value.length === 0);
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
.filters {
  display: flex;
  flex-direction: column;
  gap: 10px;
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
