<template>
  <div>
    <h1>Planning 📆</h1>
    <h2>
      Lien de souscription Ical (pour google agenda) : {{ DOMAIN }}calendar/{{
        $accessor.user.me._id
      }}
    </h2>
    <v-row class="d-flex justify-space-around py-6">
      <h1 style="width: 25%; text-align: center">Mon planning</h1>
      <v-switch
        v-model="switchType"
        class="switch-width"
        @change="getOrgaRequis"
      ></v-switch>
      <h1 style="width: 25%; text-align: center">Tous</h1>
    </v-row>
    <div v-if="!loading">
      <v-list v-for="(plan, index) in orgaRequis" :key="index" class="my-4">
        <v-list-item>
          <v-list-item-content>
            <ShowCalendar :title="plan.userName" :slots="plan.slots" />
            <v-data-table
              :headers="[
                { text: 'FT', value: 'name', width: '30%' },
                { text: 'id', value: 'count', align: 'center', width: '10%' },
                {
                  text: 'status',
                  value: 'status',
                  align: 'center',
                  width: '10%',
                },
                {
                  text: 'début',
                  value: 'start',
                  align: 'center',
                  width: '10%',
                },
                { text: 'fin', value: 'end', align: 'center', width: '10%' },
                { text: 'conflits', value: 'conflits', width: '30%' },
              ]"
              :items="plan.slots"
              :hide-default-footer="true"
              :items-per-page="-1"
            >
              <template #item.status="{ item }">
                <v-chip :color="getColor(item.status)">
                  {{ item.status }}
                </v-chip>
              </template>
              <template #item.count="{ item }">
                <a :href="/ft/ + item.count">{{ item.count }}</a>
              </template>
              <template #item.start="{ item }">
                {{ new Date(item.start).toLocaleString() }}
              </template>
              <template #item.end="{ item }">
                {{ new Date(item.end).toLocaleString() }}
              </template>
              <template #item.conflits="{ item }">
                <v-chip
                  v-for="conflit in item.conflits"
                  :key="conflit._id"
                  :color="getColor(conflit.type)"
                  class="mx-2"
                >
                  {{ getText(conflit.type) }}
                </v-chip>
              </template>
            </v-data-table>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <div v-else class="d-flex justify-center">
      <v-progress-circular indeterminate color="grey"></v-progress-circular>
    </div>
  </div>
</template>

<script lang="js">
import Vue from "vue";
import {RepoFactory} from "~/repositories/repoFactory";
import ShowCalendar from "../components/ShowCalendar";

export default Vue.extend({
  name: "Planning",
  components: {ShowCalendar},
  data() {
    return {
      switchType: false,
      orgaRequis: [],
      loading: false,
      selectedDate: "2022-05-22",
      DOMAIN: process.env.BASE_URL,
    };
  },
  async mounted() {
    if (this.$accessor.user.hasPermission("hard")) {
      await this.getOrgaRequis();
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },
  methods: {
    async getOrgaRequis() {
      this.loading = true;
      if (!this.switchType) {
        this.orgaRequis = (await RepoFactory.ftRepo.myPlanning(this, this.$accessor.user.me._id)).data;
      } else {
        this.orgaRequis = (await RepoFactory.ftRepo.getOrgaRequis(this)).data;
      }
      this.loading = false;
    },
    getColor(type) {
      switch (type) {
        case "availability":
          return "orange";
        case "TF":
          return "red";
        case "refused":
          return "red";
        case "submitted":
          return "orange";
        case "draft":
          return "grey";
        case "validated":
          return "success";
        case "affected":
          return "deep-purple";
        default:
          return "grey";
      }
    },
    getText(type) {
      switch (type) {
        case "availability":
          return "CONFLIT : PAS DISPO";
        case "TF":
          return "CONFLIT ENTRE FT";
        default:
          return "CONFLIT";
      }
    },
  },
});
</script>

<style scoped></style>
