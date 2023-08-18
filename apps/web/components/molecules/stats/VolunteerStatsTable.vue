<template>
  <v-data-table
    :headers="headers"
    :items="volunteers"
    :items-per-page="-1"
    dense
  >
    <template #item.volunteer="{ item }">
      {{ item.firstname }} {{ item.lastname }}
    </template>
    <template #item.STATIQUE="{ item }">
      {{ staticEmoji }} {{ retrieveStaticStat(item.stats) }}
    </template>
    <template #item.BAR="{ item }">
      {{ barEmoji }} {{ retrieveBarStat(item.stats) }}
    </template>
    <template #item.MANUTENTION="{ item }">
      {{ manutentionEmoji }} {{ retrieveManutentionStat(item.stats) }}
    </template>
    <template #item.FUN="{ item }">
      {{ funEmoji }} {{ retrieveFunStat(item.stats) }}
    </template>
    <template #item.RELOU="{ item }">
      {{ relouEmoji }} {{ retrieveRelouStat(item.stats) }}
    </template>
    <template #item.AUCUNE="{ item }">
      {{ unknownEmoji }} {{ retrieveUnknownStat(item.stats) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import {
  TaskCategories,
  TaskCategoryEmoji,
  TaskCategoryEmojis,
} from "~/utils/models/ft-time-span.model";
import { AssignmentStats } from "~/store/assignment.store";
import { VolunteerAssignmentStat } from "~/utils/models/user.model";
import { Duration } from "~/utils/date/duration";

function searchStatic(stat: VolunteerAssignmentStat): boolean {
  return stat.category === TaskCategories.STATIQUE;
}

function searchBar(stat: VolunteerAssignmentStat): boolean {
  return stat.category === TaskCategories.BAR;
}

function searchManutention(stat: VolunteerAssignmentStat): boolean {
  return stat.category === TaskCategories.MANUTENTION;
}

function searchFun(stat: VolunteerAssignmentStat): boolean {
  return stat.category === TaskCategories.FUN;
}

function searchRelou(stat: VolunteerAssignmentStat): boolean {
  return stat.category === TaskCategories.RELOU;
}

function searchUnknown(stat: VolunteerAssignmentStat): boolean {
  return stat.category === null;
}

export default Vue.extend({
  name: "VolunteerStatsTable",
  data: () => ({
    headers: [
      { text: "Benevole", value: "volunteer", sortable: false },
      {
        text: "Creneaux statiques",
        value: TaskCategories.STATIQUE,
        sortable: false,
      },
      { text: "Creneaux bar", value: TaskCategories.BAR, sortable: false },
      {
        text: "Creneaux manutention",
        value: TaskCategories.MANUTENTION,
        sortable: false,
      },
      { text: "Creneaux fun", value: TaskCategories.FUN, sortable: false },
      { text: "Creneaux relous", value: TaskCategories.RELOU, sortable: false },
      {
        text: "Creneaux indetermines",
        value: TaskCategories.AUCUNE,
        sortable: false,
      },
    ],
  }),
  computed: {
    volunteers(): AssignmentStats[] {
      return this.$accessor.assignment.stats;
    },
    staticEmoji(): TaskCategoryEmoji {
      return TaskCategoryEmojis.STATIQUE;
    },
    barEmoji(): TaskCategoryEmoji {
      return TaskCategoryEmojis.BAR;
    },
    manutentionEmoji(): TaskCategoryEmoji {
      return TaskCategoryEmojis.MANUTENTION;
    },
    funEmoji(): TaskCategoryEmoji {
      return TaskCategoryEmojis.FUN;
    },
    relouEmoji(): TaskCategoryEmoji {
      return TaskCategoryEmojis.RELOU;
    },
    unknownEmoji(): TaskCategoryEmoji {
      return TaskCategoryEmojis.AUCUNE;
    },
  },
  created() {
    this.$accessor.assignment.fetchStats();
  },
  methods: {
    retrieveStat(
      stats: VolunteerAssignmentStat[],
      searchFunction: (stat: VolunteerAssignmentStat) => boolean,
    ): string {
      const stat = stats.find(searchFunction);
      return Duration.fromMilliseconds(stat?.duration ?? 0).toString();
    },
    retrieveStaticStat(stats: VolunteerAssignmentStat[]): string {
      return this.retrieveStat(stats, searchStatic);
    },
    retrieveBarStat(stats: VolunteerAssignmentStat[]): string {
      return this.retrieveStat(stats, searchBar);
    },
    retrieveManutentionStat(stats: VolunteerAssignmentStat[]): string {
      return this.retrieveStat(stats, searchManutention);
    },
    retrieveFunStat(stats: VolunteerAssignmentStat[]): string {
      return this.retrieveStat(stats, searchFun);
    },
    retrieveRelouStat(stats: VolunteerAssignmentStat[]): string {
      return this.retrieveStat(stats, searchRelou);
    },
    retrieveUnknownStat(stats: VolunteerAssignmentStat[]): string {
      return this.retrieveStat(stats, searchUnknown);
    },
  },
});
</script>

<style lang="scss" scoped></style>
