<template>
  <div class="signages__listing">
    <v-data-table
      :headers="tableHeaders"
      :items="signages"
      :items-per-page="-1"
      disable-pagination
      hide-default-footer
      no-data-text="Aucune demande de signalétique"
    >
      <template #item.catalogItem="{ item }">
        <SearchSignage
          :model-value="signageCatalogItem(item)"
          :type="item.type"
          :readonly="cantLinkCatalogItem"
          hide-label
          @update-model-value="linkCatalogItem($event, item)"
        />
      </template>

      <template #item.actions="{ item }">
        <div class="signages__actions">
          <v-btn
            icon="mdi-pencil"
            density="comfortable"
            @click="openUpdateSignageDialog(item)"
          />
          <v-btn
            icon="mdi-trash-can"
            density="comfortable"
            @click="removeSignage(item)"
          />
        </div>
      </template>
    </v-data-table>

    <v-btn
      text="Ajouter une signalétique"
      color="primary"
      class="signages__add"
      @click="openAddSignageDialog"
    />

    <v-dialog v-model="isSignageDialogOpen" max-width="600">
      <FaSignageForm
        :signage="selectedSignage"
        @add="addSignage"
        @update="updateSignage"
        @close="closeDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  type Signage as FaSignage,
  type SignageCatalogItem,
  signa,
  type FestivalActivity,
  isDraft,
  APPROVED,
} from "@overbookd/festival-event";
import type { Signage as CatalogSignage } from "@overbookd/signa";
import type { TableHeaders } from "~/utils/data-table/header";

const emit = defineEmits(["add", "update", "remove"]);

const faStore = useFestivalActivityStore();

const props = defineProps({
  signages: {
    type: Array as PropType<FaSignage[]>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const tableHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Quantité", value: "quantity", sortable: true },
    { title: "Type", value: "type", sortable: true },
    { title: "Texte à écrire", value: "text" },
    { title: "Taille", value: "size" },
    { title: "Commentaire", value: "comment" },
    { title: "Référence", value: "catalogItem" },
  ];
  const actionsHeader = { title: "Actions", value: "actions" };
  return props.disabled ? baseHeaders : [...baseHeaders, actionsHeader];
});

const selectedSignage = ref<FaSignage | null>(null);

const isSignageDialogOpen = ref(false);
const openAddSignageDialog = () => {
  selectedSignage.value = null;
  isSignageDialogOpen.value = true;
};
const openUpdateSignageDialog = (signage: FaSignage) => {
  selectedSignage.value = signage;
  isSignageDialogOpen.value = true;
};
const closeDialog = () => {
  isSignageDialogOpen.value = false;
  selectedSignage.value = null;
};

const addSignage = (signage: FaSignage) => {
  emit("add", signage);
};
const updateSignage = (signage: FaSignage) => {
  emit("update", signage);
};
const removeSignage = (signage: FaSignage) => {
  emit("remove", signage);
};

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const cantLinkCatalogItem = computed(() => {
  if (isDraft(selectedActivity.value)) return true;
  const isSignaMember = useUserStore().isMemberOf(signa);
  const isAlreadyApproved = selectedActivity.value.reviews.signa === APPROVED;
  return !isSignaMember || isAlreadyApproved;
});
const linkCatalogItem = (
  catalogSignage: CatalogSignage,
  faSignage: FaSignage,
) => {
  if (cantLinkCatalogItem.value) return;
  faStore.linkSignageCatalogItem({
    signageId: faSignage.id,
    catalogItem: catalogSignage,
  });
};

const signageCatalogItem = (signage: FaSignage): SignageCatalogItem | null => {
  return "catalogItem" in signage ? signage.catalogItem : null;
};
</script>

<style lang="scss" scoped>
.signages {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
  &__actions {
    display: flex;
    gap: 10px;
  }
}
</style>
