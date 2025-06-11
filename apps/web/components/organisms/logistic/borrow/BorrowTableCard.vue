<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredBorrows"
        :loading="loading"
        loading-text="Chargement des fiches emprunts..."
        no-data-text="Aucune fiche emprunt"
        :hover="filteredBorrows.length > 0"
        :mobile="isMobile"
        @click:row="openBorrow"
        @auxclick:row="openBorrowInNewTab"
      >
        <template #top>
          <v-text-field
            v-model="search"
            label="Chercher un emprunt"
            hide-details
            clearable
            @click:clear="search = ''"
          />
        </template>

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
import { SlugifyService } from "@overbookd/slugify";
import {
  type Searchable,
  keepMatchingSearchCriteria,
} from "~/utils/search/search.utils";

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

const search = ref<string>("");

const searchableBorrows = computed<Searchable<Borrow>[]>(() => {
  return borrows.value.map((borrow) => ({
    ...borrow,
    searchable: SlugifyService.apply(`${borrow.id} ${borrow.lender}`),
  }));
});
const filteredBorrows = computed<Borrow[]>(() => {
  if (!search.value) return searchableBorrows.value;
  return searchableBorrows.value.filter((borrow) =>
    keepMatchingSearchCriteria(search.value)(borrow),
  );
});

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
