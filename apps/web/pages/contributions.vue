<template>
  <div>
    <h1>Cotisations</h1>
    <v-data-table
      :headers="headers"
      :items="adherents"
      :items-per-page="15"
      class="elevation-1"
    >
    <template #item.name="{ item }">
      {{ formatAdherentName(item) }}
    </template>

    <template #item.actions="{ item }">
      <div v-if="selectedAdherent">
        <v-text-field
          v-model="amount"
          label="Montant"
          type="number"
          suffix="€"
          :rules="[rules.number, rules.min]"
        ></v-text-field>
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
import { formatUserNameWithNickname } from "~/utils/user/user.utils";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { InputRulesData, isNumber, min } from "~/utils/rules/input.rules";

interface ContributionsData extends InputRulesData {
  headers: Header[];
  selectedAdherent: Adherent | null;
  amount: number;
}

export default Vue.extend({
    name: "Contributions",
    components: { SnackNotificationContainer },
    data: (): ContributionsData => ({
      headers: [
          { text: "Nom", value: "name" },
          { text: "Actions", value: "actions", sortable: false },
      ],

      selectedAdherent: null,
      amount: MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS,
      rules: {
        number: isNumber,
        min: min(MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS),
      },
    }),
    computed: {
      adherents(): Adherent[] {
          return this.$accessor.contribution.adherentsOutToDate;
      },
    },
    async created() {
      await this.$accessor.contributions.fetchAdherentsOutToDate();
    },
    methods: {
      payContribution(adherent: Adherent) {
        this.$accessor.contributions.payContribution({
          adherent,
          amount: this.amount
        });
        
        this.selectedAdherent = null;
        this.amount = MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS;
      },
      formatAdherentName(adherent: Adherent): string {
        return formatUserNameWithNickname(adherent);
      },
      selectAdherent(adherent: Adherent) {
        this.selectedAdherent = adherent;
        this.amount = MINIMUM_CONTRIBUTION_AMOUNT_IN_CENTS;
      }
    },
});
</script>
