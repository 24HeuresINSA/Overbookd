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
            ]"
            :items="plan.fts"
          >
            <template #item.start="{ item }">
              {{ (new Date(item.start)).toLocaleString() }}
            </template>
            <template #item.end="{ item }">
              {{ (new Date(item.end)).toLocaleString() }}
            </template>
          </v-data-table>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { RepoFactory } from "~/repositories/repoFactory";
import { FT } from "~/utils/models/FT";
import { User } from "~/utils/models/repo";

interface Data {
  users: User[];
  FTs: FT[];
  plannings: { [_id: string]: Planning };
  p: [];
  orgaRequis: [];
}

interface Planning {
  username: string;
  timeframes: Timeframe[];
}

interface Timeframe {
  start: Date;
  end: Date;
  FT: FT;
}

export default Vue.extend({
  name: "Planning",
  data(): Data {
    return {
      users: [],
      FTs: [],
      plannings: {},
      p: [],
      orgaRequis: []
    };
  },
  async mounted() {
    await this.getOrgaRequis();

    // await Vue.nextTick();
    // this.p = Object.keys(this.plannings).map((key) => {
    //   return this.plannings[key];
    // }) as any;
  },
  methods: {
    async getOrgaRequis() {
      this.orgaRequis = (await RepoFactory.ftRepo.getOrgaRequis(this)).data;
    },
  },
});
</script>

<style scoped></style>
