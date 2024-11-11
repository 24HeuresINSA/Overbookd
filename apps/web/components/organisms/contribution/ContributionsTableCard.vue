<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="filteredAdherents"
      :loading="displayOutToDateCustomers ? outToDateLoading : validLoading"
      loading-text="Chargement des bénévoles..."
      no-data-text="Aucun bénévole trouvé"
      :mobile="isMobile"
    >
      <template #top>
        <div class="filters">
          <v-text-field
            v-model="search"
            label="Chercher un bénévole"
            clearable
            hide-details
            @click:clear="search = ''"
          />
          <v-btn
            :text="toggleBtnLabbel"
            color="secondary"
            @click="toggleOutToDateCustomers"
          />
        </div>
      </template>

      <template #item.amount="{ item }">
        <PayContributionRowForm
          v-if="displayOutToDateCustomers"
          :adherent="item"
        />
        <EditContributionRowForm
          v-else
          :adherent="item as AdherentWithContribution"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>
import type {
  Adherent,
  AdherentWithContribution,
} from "@overbookd/contribution";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { toSearchable } from "~/utils/search/searchable-user.utils";
import {
  type Searchable,
  matchingSearchItems,
} from "~/utils/search/search.utils";

const contributionStore = useContributionStore();
const layoutStore = useLayoutStore();

const headers: TableHeaders = [
  { title: "Prénom", value: "firstname", sortable: true },
  { title: "Nom", value: "lastname", sortable: true },
  { title: "Surnom", value: "nickname", sortable: true },
  { title: "Paiement", value: "amount", width: "40%", sortable: true },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const search = ref<string>("");

const displayOutToDateCustomers = ref<boolean>(true);
const toggleOutToDateCustomers = () => {
  displayOutToDateCustomers.value = !displayOutToDateCustomers.value;
};
const toggleBtnLabbel = computed<string>(() =>
  displayOutToDateCustomers.value
    ? "Afficher les cotisants"
    : "Afficher les non cotisants",
);

const outToDateAdherents = computed<Adherent[]>(() => {
  return contributionStore.adherentsOutToDate;
});
const outToDateLoading = ref<boolean>(outToDateAdherents.value.length === 0);
contributionStore
  .fetchAdherentsOutToDate()
  .then(() => (outToDateLoading.value = false));
const searchableOutToDateAdherents = computed<Searchable<Adherent>[]>(() => {
  return outToDateAdherents.value.map(toSearchable);
});

const validAdherents = computed<Adherent[]>(() => {
  return contributionStore.adherentsOutToDate;
});
const validLoading = ref<boolean>(validAdherents.value.length === 0);
contributionStore.fetchAdherentsWithValidContribution().then(() => {
  validLoading.value = false;
});
const searchableValidAdherents = computed<
  Searchable<AdherentWithContribution>[]
>(() => {
  return contributionStore.validAdherents.map(toSearchable);
});

const filteredAdherents = computed<(Adherent | AdherentWithContribution)[]>(
  () => {
    const adherents = displayOutToDateCustomers.value
      ? searchableOutToDateAdherents.value
      : searchableValidAdherents.value;
    return matchingSearchItems(adherents, search.value);
  },
);
</script>

<style scoped>
.filters {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 10px 20px;
}
</style>
