<template>
  <div>
    <h1>Cotisations</h1>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/data-table.model";
import { Adherent } from "@overbookd/contribution";

interface ContributionsData {
  headers: Header[];
}

export default Vue.extend({
  name: "Contributions",
  data: (): ContributionsData => ({
    headers: [
      { text: "Nom", value: "name" },
    ],
  }),
  computed: {
    adherents(): Adherent[] {
      return this.$accessor.contribution.adherentsOutToDate;
    },
  },
  async created() {
    await this.$accessor.contributions.fetchAdherentsOutToDate();
  },
});
</script>
