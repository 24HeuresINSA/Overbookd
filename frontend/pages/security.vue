<template>
  <div>
    <v-data-table :headers="headers" :items="items">
      <template #[`item.pass`]="{ item }">
        <span v-if="item.pass">
          <v-icon color="green">mdi-check-bold</v-icon>
        </span>
        <span v-else> <v-icon color="red">mdi-close-thick</v-icon> </span>
      </template>
      <template #[`item.action`]="{ item }">
        <v-btn v-if="item.pass" color="red" @click="generatePass(item)">
          Générer le pass
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="isGeneratingPass" max-width="600">
      <v-card>
        <v-card-title>Information du Pass</v-card-title>
        <v-card-text>{{ currentPassInformation }}</v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import * as FAHandler from "../utils/models/FA";

export default Vue.extend({
  name: "Security",
  data() {
    return {
      headers: [
        {
          text: "Nom FA",
          value: "name",
          sortable: true,
          align: "left",
          width: "200",
        },
        {
          text: "Pass requis",
          value: "pass",
          sortable: true,
          align: "left",
          width: "200",
        },
        {
          text: "Générer Pass",
          value: "action",
          sortable: false,
          align: "left",
          width: "200",
        },
      ],
      isGeneratingPass: false,
      currentPassInformation: [],
    };
  },
  computed: {
    FAs(): FAHandler.FA[] {
      return this.$accessor.FA.FAs;
    },
    items(): any {
      return this.FAs.map((fa) => {
        return {
          name: fa.general!.name!,
          pass: fa.securityPasses.length > 0,
          fa: fa,
        };
      });
    },
  },
  async mounted() {
    if (!(await this.$accessor.FA.fetchAll())) {
      console.log("Error fetching FAs");
    }
    console.log(this.FAs[0]);
  },
  methods: {
    generatePass(item) {
      this.isGeneratingPass = true;
      this.currentPassInformation = item;
      console.log(item.fa.securityPasses);
    },
  },
});
</script>

<style scoped></style>
