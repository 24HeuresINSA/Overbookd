<template>
  <div>
    <h1>Planning 📆</h1>
    <v-list v-for="plan in orgaRequis" :key="plan._id">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ plan._id }}</v-list-item-title>
          <v-data-table
              :headers="[
              { text: 'FT', value: 'name' },
              { text: 'id', value: 'count' },
              { text: 'début', value: 'start' },
              { text: 'fin', value: 'end' },
              { text: 'conflits', value: 'conflits' },
            ]"
              :items="plan.fts"
          >
            <template #item.start="{ item }">
              {{ (new Date(item.start)).toLocaleString() }}
            </template>
            <template #item.end="{ item }">
              {{ (new Date(item.end)).toLocaleString() }}
            </template>
            <template #item.conflits="{ item }">
              {{ item.conflits }}
            </template>
          </v-data-table>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {RepoFactory} from "~/repositories/repoFactory";
import {FT} from "~/utils/models/FT";

export default Vue.extend({
  name: "Planning",
  data() {
    return {
      orgaRequis: []
    };
  },
  async mounted() {
    await this.getOrgaRequis();
  },
  methods: {
    async getOrgaRequis() {
      this.orgaRequis = (await RepoFactory.ftRepo.getOrgaRequis(this)).data;
    },
  },
});
</script>

<style scoped></style>
