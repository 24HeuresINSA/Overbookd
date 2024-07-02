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
import { SlugifyService } from "@overbookd/slugify";
import {
  type Searchable,
  matchingSearchItems,
} from "~/utils/search/search.utils";

const contributionStore = useContributionStore();

const headers = [
  { title: "Prénom", value: "firstname" },
  { title: "Nom", value: "lastname" },
  { title: "Surnom", value: "nickname" },
  { title: "Paiement", value: "payment", width: "30%", sortable: false },
];

const search = ref("");

const adherents = computed<Adherent[]>(() => {
  return contributionStore.adherentsOutToDate;
});

const loading = ref(true);
if (adherents.value.length > 0) loading.value = false;
contributionStore.fetchAdherentsOutToDate();
watch(adherents, () => (loading.value = false));

const searchableAdherents = computed<Searchable<Adherent>[]>(() => {
  return adherents.value.map((adherent) => ({
    ...adherent,
    searchable: SlugifyService.apply(
      `${adherent.firstname} ${adherent.lastname} ${adherent.nickname}`,
    ),
  }));
});

const filteredAdherents = computed<Adherent[]>(() => {
  return matchingSearchItems(searchableAdherents.value, search.value);
});
</script>
