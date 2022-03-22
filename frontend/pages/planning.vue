<template>
  <div>
    <h1>Planning 📆</h1>
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
            <v-list-item-title style="font-weight: bold; font-size: 25px"
              >{{ plan._id.username }}
            </v-list-item-title>
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
              :items="plan.fts"
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
    <div class="d-flex justify-center" v-else>
      <v-progress-circular indeterminate color="grey"></v-progress-circular>
    </div>
    <div class="mt-10" v-if="!switchType">
      <v-sheet tile height="54" class="d-flex">
        <v-btn icon class="ma-2" @click="$refs.FormCalendar.prev()">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon class="ma-2" @click="$refs.FormCalendar.next()">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-sheet>
      <v-calendar
          ref="FormCalendar"
          v-model="selectedDate"
          color="primary"
          type="week"
          :weekdays="[1, 2, 3, 4, 5, 6, 0]"
          :events="events"
      ></v-calendar>
    </div>
  </div>
</template>

<script lang="js">
import Vue from "vue";
import {RepoFactory} from "~/repositories/repoFactory";

export default Vue.extend({
  name: "Planning",
  data() {
    return {
      switchType: false,
      orgaRequis: [],
      loading: false,
      selectedDate: "2022-05-22",
      events: []
    };
  },
  async mounted() {
    if (this.$accessor.user.hasRole("hard")) {
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
        if(this.events.length === 0){
          this.orgaRequis[0].fts.forEach((timeslot) => {
            this.events.push({
              name: timeslot.name,
              start: this.getFormattedDate(new Date(timeslot.start)),
              end: this.getFormattedDate(new Date(timeslot.end)),
              color: this.getColor(timeslot.status),
            });
          })
        }
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
        case "ready":
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
    getFormattedDate(date) {
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + (date.getDate())).slice(-2);
      const year = date.getFullYear();
      const hour =  ("0" + (date.getHours())).slice(-2);
      const min =  ("0" + (date.getMinutes())).slice(-2);
      const seg = ("0" + (date.getSeconds())).slice(-2);
      return year + "-" + month + "-" + day + " " + hour + ":" +  min + ":" + seg;
    },
  },
});
</script>

<style scoped></style>
