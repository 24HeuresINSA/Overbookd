<template>
  <div>
    <h1>Cotisations</h1>
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
          class="mx-4"
        ></v-text-field>
      </template>

      <template #item.actions="{ item }">
        <div v-if="isSelectedAdherent(item)" class="form">
          <v-text-field
            v-model="amount"
            label="Montant"
            type="number"
            suffix="€"
            class="amount-input"
            :rules="[rules.number, rules.min]"
          ></v-text-field>
          <v-btn icon color="error" @click="unselectAdherent">
            <v-icon> mdi-close </v-icon>
          </v-btn>
          <v-btn icon color="success" @click="payContribution(item)">
            <v-icon> mdi-check </v-icon>
          </v-btn>
        </div>

        <v-btn v-else icon @click="selectAdherent(item)">
          <v-icon> mdi-play </v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/data-table.model";
import {
  Adherent,
  MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS,
} from "@overbookd/contribution";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";

interface ContributionsData extends InputRulesData {
  headers: Header[];
  selectedAdherent: Adherent | null;
  amount: number;
  search: string;
}

export default Vue.extend({
  name: "Contributions",
  components: { SnackNotificationContainer },
  data: (): ContributionsData => ({
    headers: [
      { text: "Prénom", value: "firstname" },
      { text: "Nom", value: "lastname" },
      { text: "Surnom", value: "nickname" },
      { text: "Actions", value: "actions", width: "30%", sortable: false },
    ],

    selectedAdherent: null,
    amount: MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS,
    search: "",

    rules: {
      number: isNumber,
      min: min(MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS),
    },
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
  methods: {
    isSelectedAdherent(adherent: Adherent): boolean {
      return this.selectedAdherent?.id === adherent.id;
    },
    payContribution(adherent: Adherent) {
      this.$accessor.contribution.payContribution({
        adherent,
        amount: this.amount,
      });

      this.unselectAdherent();
    },
    selectAdherent(adherent: Adherent) {
      this.selectedAdherent = adherent;
      this.amount = MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS;
    },
    unselectAdherent() {
      this.selectedAdherent = null;
      this.amount = MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS;
    },
  },
});
</script>

<style lang="scss" scoped>
.form {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.amount-input {
  width: 100px;
}
</style>
