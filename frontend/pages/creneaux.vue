<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="timeSpans"
      dense
      :items-per-page="-1"
    >
      <template #[`item.start`]="{ item }">
        {{ new Date(item.start).toLocaleString() }}
      </template>
      <template #[`item.end`]="{ item }">
        {{ new Date(item.end).toLocaleString() }}
      </template>
      <template #[`item.required`]="{ item }">
        <div v-for="user in item.required" :key="user">
          {{ mapUser(user) }}
          <br />
        </div>
      </template>
      <template #[`item.assigned`]="{ item }">
        <div v-for="user in item.assigned" :key="user">
          {{ mapUser(user) }}
          <br />
        </div>
      </template>
      <template #[`item.FTID`]="{ item }">
        <a :href="`/ft/${item.FTID}`">{{ item.FTID }}</a>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Header } from "~/utils/models/Data";
import TimeSpanRepo from "~/repositories/timeSpanRepo";
import UserRepo from "~/repositories/userRepo";
import { safeCall } from "../utils/api/calls";
import _ from "lodash";

interface Data {
  headers: Header[];
  timeSpans: any[];
  users: any[];
}

export default Vue.extend({
  name: "PassSecu",
  data(): Data {
    return {
      headers: [
        { text: "Début", value: "start", width: "15%" },
        { text: "Fin", value: "end", width: "15%" },
        { text: "Requis", value: "required" },
        { text: "Assigné", value: "assigned" },
        { text: "FT", value: "FTID" },
      ],
      timeSpans: [],
      users: [],
    };
  },

  async beforeMount() {
    if (this.$accessor.user.hasRole("hard")) {
      await this.getAllTimeSpans();
      await this.getAllUsers();
    } else {
      await this.$router.push({
        path: "/",
      });
    }
  },

  methods: {
    async getAllTimeSpans() {
      const res = await safeCall(this.$store, TimeSpanRepo.getAll(this.$store));
      if (res) {
        const helper = {};
        const grouped = [...res.data].reduce((acc, cur) => {
          const key =
            cur.start.toString() +
            "-" +
            cur.end.toString() +
            "-" +
            cur.FTID.toString();
          if (!helper[key]) {
            helper[key] = {
              start: cur.start,
              end: cur.end,
              FTID: cur.FTID,
              required: [],
              assigned: [],
            };
            acc.push(helper[key]);
          }
          if (!helper[key].required.includes(cur.required)) {
            helper[key].required.push(cur.required);
          }
          if (!helper[key].assigned.includes(cur.assigned)) {
            helper[key].assigned.push(cur.assigned);
          }
          return acc;
        }, []);
        this.timeSpans = grouped;
      }
    },
    async getAllUsers() {
      const res = await safeCall(
        this.$store,
        UserRepo.getAllUsernames(this.$store)
      );
      if (res) {
        this.users = res.data;
      }
    },
    mapUser(userId: string) {
      if (!userId) {
        return "";
      }
      if (userId.length != 24) {
        return userId;
      }
      const user = this.users.find((u) => u._id == userId);
      return user ? user.username : "";
    },
  },
});
</script>
