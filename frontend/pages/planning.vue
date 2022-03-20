<template>
  <div>
    <h1>Planning 📆</h1>
    <v-list v-for="plan in orgaRequis" :key="plan._id">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ plan._id }}</v-list-item-title>
          <v-data-table
              :headers="[
              { text: 'FT', value: 'name', sortable: false },
              { text: 'id', value: 'count', sortable: false },
              { text: 'début', value: 'start', sortable: false },
              { text: 'fin', value: 'end', sortable: false },
              { text: 'conflits', value: 'conflits', sortable: false },
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
              <v-chip
                  v-for="conflit in item.conflits"
                  :key="conflit._id"
                  :color="getColor(conflit.type)"
              >
                {{ getText(conflit.type) }}
              </v-chip>
            </template>
          </v-data-table>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="js">
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
    getColor(type){
      switch (type){
        case "availability":
          return "orange";
        case "TF":
          return "red";
        default:
          return "grey";
      }
    },
    getText(type){
      switch (type){
        case "availability":
          return "CONFLIT : PAS DISPO";
        case "TF":
          return "CONFLIT ENTRE FT";
        default:
          return "CONFLIT";
      }
    }
  },
});
</script>

<style scoped></style>
