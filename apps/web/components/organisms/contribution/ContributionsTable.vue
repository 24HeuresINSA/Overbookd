<template>
  <v-data-table
    :headers="headers"
    :items="filteredAdherents"
    :items-per-page="15"
    class="elevation-1"
  >
    <template #top>
      <v-text-field
        v-model="search"
        label="Chercher un membre"
        class="search-field"
      ></v-text-field>
    </template>

    <template #body="{ items }">
      <tbody>
        <ContributionRow
          v-for="item in items"
          :key="item.id"
          :adherent="item"
        ></ContributionRow>
      </tbody>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import ContributionRow from "../../molecules/contribution/ContributionRow.vue";
import { Header } from "~/utils/models/data-table.model";
import { Adherent } from "@overbookd/contribution";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";

type ContributionsTableData = {
  headers: Header[];
  search: string;
}

export default Vue.extend({
  name: "ContributionsTable",
  components: { ContributionRow },
  data: (): ContributionsTableData => ({
    headers: [
      { text: "Prénom", value: "firstname" },
      { text: "Nom", value: "lastname" },
      { text: "Surnom", value: "nickname" },
      { text: "Paiement", value: "payment", width: "30%", sortable: false },
    ],
    search: "",
  }),
  computed: {
    adherents(): Adherent[] {
      return this.$accessor.contribution.adherentsOutToDate;
    },
    searchableAdherents(): Searchable<Adherent>[] {
      return this.adherents.map((adherent) => ({
        ...adherent,
        searchable: SlugifyService.apply(
          `${adherent.firstname} ${adherent.lastname} ${adherent.nickname}`,
        ),
      }));
    },
    filteredAdherents(): Adherent[] {
      return this.searchableAdherents.filter((adherent) => {
        const slugifiedSearch = SlugifyService.apply(this.search);
        return adherent.searchable.includes(slugifiedSearch);
      });
    },
  },
  async created() {
    await this.$accessor.contribution.fetchAdherentsOutToDate();
  },
});
</script>

<style lang="scss" scoped>
.search-field {
  margin: 0 16px;
}
</style>
