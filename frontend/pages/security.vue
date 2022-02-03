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
          <v-icon></v-icon>
        </v-btn>
      </template>
    </v-data-table>
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
          text: "Génerer Pass",
          value: "action",
          sortable: false,
          align: "left",
          width: "200",
        },
      ],
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
      console.log(item);
    },
  },
});
</script>

<style scoped></style>
