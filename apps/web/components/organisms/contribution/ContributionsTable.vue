<template>
  <v-data-table
    :headers="headers"
    :items="filteredAdherents"
    :items-per-page="20"
    class="elevation-1"
    :loading="loading"
    loading-text="Chargement des bénévoles..."
    no-data-text="Aucun bénévole trouvé"
  >
    <template #top>
      <v-text-field v-model="search" label="Chercher un bénévole" />
    </template>

    <template #item.payment="{ item }">
      <ContributionPaymentForm :adherent="item" />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { Adherent } from "@overbookd/contribution";
import type { TableHeaders } from "~/utils/data-table/header";
import { toSearchable } from "~/utils/search/search-user";
import {
  type Searchable,
  matchingSearchItems,
} from "~/utils/search/search.utils";

const contributionStore = useContributionStore();

const headers: TableHeaders = [
  { title: "Prénom", value: "firstname", sortable: true },
  { title: "Nom", value: "lastname", sortable: true },
  { title: "Surnom", value: "nickname", sortable: true },
  { title: "Paiement", value: "payment", width: "30%" },
];

const search = ref("");

const adherents = computed<Adherent[]>(() => {
  return contributionStore.adherentsOutToDate;
});

const loading = ref(adherents.value.length === 0);
contributionStore.fetchAdherentsOutToDate().then(() => (loading.value = false));

const searchableAdherents = computed<Searchable<Adherent>[]>(() => {
  return adherents.value.map(toSearchable);
});

const filteredAdherents = computed<Adherent[]>(() => {
  return matchingSearchItems(searchableAdherents.value, search.value);
});
</script>
