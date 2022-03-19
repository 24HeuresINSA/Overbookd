<template>
  <div>
    <h1>Planning 📆</h1>
    <v-list v-for="plan in p" :key="plan.username">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>{{ plan.username }}</v-list-item-title>
          <v-data-table
            :headers="[
              { text: 'FT', value: 'FT.general.name' },
              { text: 'ID', value: 'FT.count' },
              { text: 'Début', value: 'start' },
              { text: 'Fin', value: 'end' },
            ]"
            :items="plan.timeframes"
          >
            <template #item.start="{ item }">
              {{ item.start.toLocaleString() }}
            </template>
            <template #item.end="{ item }">
              {{ item.end.toLocaleString() }}
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
    };
  },
  async mounted() {
    await this.getUsers();
    await this.getFTs();

    this.users.forEach(({ _id, username }) => {
      if (username) {
        this.plannings[_id] = {
          username,
          timeframes: this.getTimeframes(_id),
        };
      }
    });
    await Vue.nextTick();
    this.p = Object.keys(this.plannings).map((key) => {
      return this.plannings[key];
    }) as any;
  },
  methods: {
    async getUsers() {
      this.users = (await RepoFactory.userRepo.getAllUsernames(this)).data;
    },
    async getFTs() {
      this.FTs = (await RepoFactory.ftRepo.getAllFTs(this)).data.data;
    },
    getTimeframes(_id: string): Timeframe[] {
      let res: Timeframe[] = [];
      this.FTs.forEach((FT) => {
        if (FT.timeframes) {
          FT.timeframes.forEach((timeframe) => {
            if (timeframe && timeframe.required) {
              timeframe.required.forEach((req) => {
                if (req.type === "user") {
                  if (req.user && req.user._id && req.user._id === _id) {
                    res.push({
                      start: new Date(timeframe.start),
                      end: new Date(timeframe.end),
                      FT,
                    });
                  }
                }
              });
            }
          });
        }
      });
      return res;
    },
  },
});
</script>

<style scoped></style>
