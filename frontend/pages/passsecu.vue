<template>
  <div>
    <v-data-table :headers="headers" :items="pass" dense>
      <template #[`item.fullname`]="{ item }">
        {{ item.fullname || "az" }}
      </template>
      <template #[`item.phone`]="{ item }">
        {{ item.phone || "az" }}
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/Data";

interface Data {
  headers: Header[];
  pass: [];
}

export default Vue.extend({
  name: "PassSecu",
  data(): Data {
    return {
      headers: [
        { text: "Nom", value: "fullname" },
        { text: "Tél", value: "phone" },
      ],
      pass: [],
    };
  },

  async beforeMount() {
    await this.getAllPassSecu();
  },

  methods: {
    async getAllPassSecu() {
      this.pass = (await this.$axios.get("/passsecu")).data;
      console.log(this.passsecu);
    },
  },
});
</script>
