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
      :items-per-page="25"
    >
      <template #top>
        <v-text-field
          v-model="FTID"
          type="number"
          label="Search FT number"
        ></v-text-field>
      </template>
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
        <v-btn color="red" dark icon @click="confirmDelete(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog v-model="isDeleting" max-width="800">
      <v-card v-if="selectedTimeSpan">
        <v-card-title>Supprimer ce créneau ?</v-card-title>
        <v-card-text>
          <p class="task">Créneau pour la tache #{{ selectedTimeSpan.FTID }}</p>
          <p class="timing">
            {{ new Date(selectedTimeSpan.start).toLocaleString() }} -
            {{ new Date(selectedTimeSpan.end).toLocaleString() }}
          </p>
          <p v-show="selectedTimeSpan.assigned" class="assigned">
            Ou {{ mapUser(selectedTimeSpan.assigned) }} a été affecté
          </p>
        </v-card-text>
        <div style="display: flex; justify-content: center; padding: 1%">
          <v-btn color="green" style="margin: 2%" @click="deleteTimespan()"
            >OUI</v-btn
          >
          <v-btn color="red" style="margin: 2%" @click="no()">NON</v-btn>
        </div>
      </v-card>
    </v-dialog>
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
  FTID: string;
  headers: Header[];
  timeSpans: any[];
  users: any[];
  assignmentPerCentage: number;
  isDeleting: boolean;
  selectedTimeSpan: any;
}

export default Vue.extend({
  name: "Creneaux",
  data(): Data {
    return {
      FTID: "",
      headers: [
        { text: "Début", value: "start", width: "20%" },
        { text: "Fin", value: "end", width: "20%" },
        { text: "Requis", value: "required" },
        { text: "Assigné", value: "assigned" },
        {
          text: "FT",
          value: "FTID",
          width: "5%",
          filter: (this as any).filterFT,
        },
        { text: "Action", value: "action", width: "5%", sortable: false },
      ],
      timeSpans: [],
      users: [],
      assignmentPerCentage: 0,
      isDeleting: false,
      selectedTimeSpan: undefined,
    };
  },

  async beforeMount() {
    if (this.$accessor.user.hasPermission("can-affect")) {
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
    filterFT(potentialFT: number) {
      if (!this.FTID) return true;

      return potentialFT === parseInt(this.FTID);
    },
    async getAllTimeSpans() {
      const res = await safeCall(this.$store, TimeSpanRepo.getAll(this.$store));
      if (res) {
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
    deleteTimespan() {
      this.$accessor.assignment.deleteTimespan(this.selectedTimeSpan);
      this.timeSpans.splice(this.timeSpans.indexOf(this.selectedTimeSpan), 1);
      this.selectedTimeSpan = undefined;
      this.isDeleting = false;
    },
    confirmDelete(item: TimeSpan) {
      this.isDeleting = true;
      this.selectedTimeSpan = item;
    },
    no() {
      this.isDeleting = false;
      this.selectedTimeSpan = undefined;
    },
  },
});
</script>
