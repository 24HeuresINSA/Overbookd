<template>
  <div class="signages__listing">
    <v-data-table
      :headers="tableHeaders"
      :items="signages"
      :items-per-page="-1"
      no-data-text="Aucune demande de signalétique"
      :mobile="isMobile"
      disable-pagination
      hide-default-footer
    >
      <template #item.catalogItem="{ item }">
        <SearchSignage
          :model-value="signageCatalogItem(item)"
          :type="item.type"
          :readonly="cantLinkCatalogItem"
          density="compact"
          hide-label
          hide-details
          @update:model-value="linkCatalogItem(item.id, $event?.id)"
        />
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
          @click="removeSignage(item)"
        />
      </template>
    </v-data-table>

    <v-btn
      text="Ajouter une signalétique"
      color="primary"
      class="signages__add"
      @click="openAddSignageDialog"
    />

    <v-dialog v-model="isSignageDialogOpen" max-width="600">
      <FaSignageFormDialogCard
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
import type { TableHeaders } from "~/utils/vuetify/component-props";

const faStore = useFestivalActivityStore();
const layoutStore = useLayoutStore();

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

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const isDraftActivity = computed<boolean>(() =>
  isDraft(selectedActivity.value),
);

const tableHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Quantité", value: "quantity", sortable: true },
    { title: "Type", value: "type", sortable: true },
    { title: "Texte à écrire", value: "text" },
    { title: "Taille", value: "size" },
    { title: "Commentaire", value: "comment" },
  ];
  const referenceHeader = !isDraftActivity.value
    ? [{ title: "Référence", value: "catalogItem" }]
    : [];
  const actionsHeader = !props.disabled
    ? [{ title: "Actions", value: "actions" }]
    : [];

  return [...baseHeaders, ...referenceHeader, ...actionsHeader];
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const selectedSignage = ref<FaSignage | null>(null);

const isSignageDialogOpen = ref<boolean>(false);
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

const emit = defineEmits(["add", "update", "remove"]);
const addSignage = (signage: FaSignage) => emit("add", signage);
const updateSignage = (signage: FaSignage) => emit("update", signage);
const removeSignage = (signage: FaSignage) => emit("remove", signage);

const cantLinkCatalogItem = computed<boolean>(() => {
  if (isDraftActivity.value) return true;
  const isSignaMember = useUserStore().isMemberOf(signa);
  const isAlreadyApproved = selectedActivity.value.reviews.signa === APPROVED;
  return !isSignaMember || isAlreadyApproved;
});
const linkCatalogItem = (
  faSignageId: FaSignage["id"],
  catalogSignageId?: CatalogSignage["id"],
) => {
  if (cantLinkCatalogItem.value || !catalogSignageId) return;
  faStore.linkSignageCatalogItem(faSignageId, catalogSignageId);
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
}
</style>
