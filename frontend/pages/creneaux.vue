<template>
  <div>
    <v-progress-linear
      style="width: 100%; height: 20px"
      :value="assignmentPerCentage"
    >
      <template #default="{ value }">
        <strong>{{ Math.ceil(value) }}% affecté</strong>
      </template>
    </v-progress-linear>
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
        <div>
          {{ mapUser(item.required) }}
          <br />
        </div>
      </template>
      <template #[`item.assigned`]="{ item }">
        <div>
          {{ mapUser(item.assigned) }}
          <br />
        </div>
      </template>
      <template #[`item.FTID`]="{ item }">
        <a :href="`/ft/${item.FTID}`">{{ item.FTID }}</a>
      </template>
      <template #[`item.action`]="{ item }">
        <v-btn color="red" dark icon @click="deleteTimespan(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
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
import { TimeSpan } from "~/utils/models/TimeSpan";

interface Data {
  headers: Header[];
  timeSpans: any[];
  users: any[];
  assignmentPerCentage: number;
}

declare interface Mymap {
  [key: string]: any;
}

export default Vue.extend({
  name: "Creneaux",
  data(): Data {
    return {
      headers: [
        { text: "Début", value: "start", width: "20%" },
        { text: "Fin", value: "end", width: "20%" },
        { text: "Requis", value: "required" },
        { text: "Assigné", value: "assigned" },
        { text: "FT", value: "FTID", width: "5%" },
        { text: "Action", value: "action", width: "5%", sortable: false },
      ],
      timeSpans: [],
      users: [],
      assignmentPerCentage: 0,
    };
  },

  async beforeMount() {
    if (this.$accessor.user.hasRole(["humain", "bureau", "admin"])) {
      await this.getAllTimeSpans();
      await this.getAllUsers();
      this.assignmentPerCentage =
        (this.timeSpans.filter((ts) => ts.assigned).length /
          this.timeSpans.length) *
        100;
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
        const helper = {} as Mymap;
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
        this.timeSpans = res.data;
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
    deleteTimespan(item: TimeSpan) {
      this.$accessor.assignment.deleteTimespan(item);
      this.timeSpans.splice(this.timeSpans.indexOf(item), 1);
    },
  },
});
</script>
