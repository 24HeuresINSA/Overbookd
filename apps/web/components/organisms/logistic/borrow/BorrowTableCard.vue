<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="borrows"
        :items-per-page="20"
        :loading="loading"
        loading-text="Chargement des fiches emprunts..."
        no-data-text="Aucune fiche emprunt"
        :hover="borrows.length > 0"
        :mobile="isMobile"
        @click:row="openBorrow"
        @auxclick:row="openBorrowInNewTab"
      >
        <template #item.availableOn="{ item }">
          {{ formatDateToHumanReadable(item.availableOn) }}
        </template>
        <template #item.unavailableOn="{ item }">
          {{ formatDateToHumanReadable(item.unavailableOn) }}
        </template>

        <template #item.remove="{ item }">
          <v-btn
            icon="mdi-trash-can"
            size="small"
            variant="flat"
            @click.stop="removeBorrow(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Borrow } from "@overbookd/logistic";
import { BORROW_GEARS_URL } from "@overbookd/web-page";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import {
  openPageWithId,
  openPageWithIdInNewTab,
} from "~/utils/navigation/router.utils";
import { formatDateToHumanReadable } from "@overbookd/time";

const borrowStore = useBorrowStore();
const layoutStore = useLayoutStore();

const headers: TableHeaders = [
  { title: "Nom", value: "lender", sortable: true },
  { title: "Date de disponibilité", value: "availableOn", sortable: true },
  { title: "Date de retour", value: "unavailableOn", sortable: true },
  { title: "Supprimer", value: "remove", align: "center" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const borrows = computed(() => borrowStore.all);
const loading = ref<boolean>(borrows.value.length === 0);
borrowStore.fetchAll().then(() => (loading.value = false));

const removeBorrow = async (borrow: Borrow) => {
  await borrowStore.remove(borrow.id);
};

const openBorrowInNewTab = (_: PointerEvent, target: { item: Borrow }) => {
  const { id } = { ...target.item };
  openPageWithIdInNewTab(BORROW_GEARS_URL, id);
};

const openBorrow = (event: PointerEvent, target: { item: Borrow }) => {
  const { id } = { ...target.item };
  openPageWithId(event, BORROW_GEARS_URL, id);
};
</script>

<style scoped>
.borrow-list {
  cursor: pointer;
}
</style>
