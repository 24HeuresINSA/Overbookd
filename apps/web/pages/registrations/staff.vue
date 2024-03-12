<template>
  <div class="registrations">
    <h1>Admission organisateurs</h1>
    <RegistrationConfiguration class="registration-configuration" />
    <v-divider></v-divider>
    <v-data-table
      v-model="selectedStaffs"
      :headers="headers"
      :items="filteredNewcomers"
      :items-per-page="30"
      show-select
      class="elevation-1 newcomer-listing"
    >
      <template #top>
        <div class="filters">
          <v-text-field
            v-model="searchNewcomer"
            label="Rechercher un nouvel arrivant"
            class="search"
          ></v-text-field>
          <v-btn
            class="ma-2"
            color="primary"
            :outlined="!last30DaysNewcomers"
            @click="toggleLast30DaysNewcomers"
          >
            Inscrits dans les 30 derniers jours
          </v-btn>
        </div>
      </template>

      <template #item.registeredAt="{ item }">
        {{ formatDate(item.registeredAt) }}
      </template>

      <template #item.teams="{ item }">
        <TeamChip v-for="team of item.teams" :key="team" :team="team" />
      </template>

      <template #item.action="{ item }">
        <v-btn color="primary" @click="forgetHim(item.email)">
          Supprimer l'inscription
        </v-btn>
      </template>

      <template #no-data> Aucun nouvel arrivant </template>
    </v-data-table>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        :disabled="noStaffSelected"
        @click="enrollNewcomers"
      >
        Enrôler en tant que hard
      </v-btn>
    </v-card-actions>

    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { Header } from "~/utils/models/data-table.model";
import { JoinableTeam, joinableTeams } from "@overbookd/registration";
import { formatLocalDate } from "~/utils/date/date.utils";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";
import RegistrationConfiguration from "~/components/molecules/registration/RegistrationConfiguration.vue";
import { ONE_DAY_IN_MS } from "@overbookd/period";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { EnrollableStaff } from "@overbookd/http";

interface RegistrationsData {
  headers: Header[];
  last30DaysNewcomers: boolean;
  searchNewcomer: string;
  selectedStaffs: EnrollableStaff[];
}

type Filter = (newcomer: Searchable<EnrollableStaff>) => boolean;

export default Vue.extend({
  name: "RegistrationsHard",
  components: {
    TeamChip,
    SnackNotificationContainer,
    RegistrationConfiguration,
  },
  data: (): RegistrationsData => ({
    headers: [
      { text: "Prénom", value: "firstname" },
      { text: "Nom", value: "lastname" },
      { text: "Email", value: "email" },
      { text: "Date d'inscription", value: "registeredAt" },
      { text: "Équipes", value: "teams", sortable: false },
      { text: "Action", value: "action", sortable: false },
    ],
    last30DaysNewcomers: true,
    searchNewcomer: "",
    selectedStaffs: [],
  }),
  head: () => ({
    title: "Admission organisateurs",
  }),
  computed: {
    searchableNewcomers(): Searchable<EnrollableStaff>[] {
      return this.$accessor.registration.staffs.map((newcomer) => ({
        ...newcomer,
        searchable: SlugifyService.apply(
          `${newcomer.firstname} ${newcomer.lastname}`,
        ),
      }));
    },
    filteredNewcomers(): EnrollableStaff[] {
      const search = SlugifyService.apply(this.searchNewcomer);
      const thirtyDaysAgo = Date.now() - 30 * ONE_DAY_IN_MS;
      return this.searchableNewcomers.filter((newcomer) => {
        return (
          this.isMatchingNameSearch(search)(newcomer) &&
          this.isMatchingRegistrationDateLimit(thirtyDaysAgo)(newcomer)
        );
      });
    },
    joinableTeams(): JoinableTeam[] {
      return Object.values(joinableTeams);
    },
    noStaffSelected(): boolean {
      return this.selectedStaffs.length === 0;
    },
  },
  mounted() {
    this.$accessor.registration.getStaffs();
  },
  methods: {
    formatDate(date: Date): string {
      return formatLocalDate(date);
    },
    enrollNewcomers() {
      this.$accessor.registration.enrollStaffs(this.selectedStaffs);
      this.selectedStaffs = [];
    },
    toggleLast30DaysNewcomers() {
      this.last30DaysNewcomers = !this.last30DaysNewcomers;
    },
    isMatchingNameSearch(search: string): Filter {
      return ({ searchable }: Searchable<EnrollableStaff>) =>
        searchable.includes(search);
    },
    forgetHim(email: string) {
      this.$accessor.registration.forgetHim(email);
    },
    isMatchingRegistrationDateLimit(dateLimit: number): Filter {
      return ({ registeredAt }: EnrollableStaff) => {
        if (!this.last30DaysNewcomers) return true;
        return registeredAt.getTime() > dateLimit;
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.registrations {
  margin-left: 10px;
  @media screen and (max-width: $mobile-max-width) {
    margin-left: 0;
  }
}

.filters {
  display: flex;
  gap: 20px;
  margin: 10px 20px;
}

.registration-configuration {
  margin: 10px 0;
}
</style>
