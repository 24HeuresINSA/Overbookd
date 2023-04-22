<template>
  <v-data-table :headers="headers" :items="volunteers" dense>
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
} from "~/utils/models/ftTimespan";
import { AssignmentStats } from "~/store/assignment";
import { VolunteerAssignmentStat } from "~/utils/models/user";
import { Duration } from "~/utils/date/duration";

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
    retrieveStaticStat(stats: VolunteerAssignmentStat[]): string {
      const stat = stats.find(
        (stat) => stat.category === TaskCategories.STATIQUE
      );
      return Duration.fromMilliseconds(stat?.duration ?? 0).toString();
    },
    retrieveBarStat(stats: VolunteerAssignmentStat[]): string {
      const stat = stats.find((stat) => stat.category === TaskCategories.BAR);
      return Duration.fromMilliseconds(stat?.duration ?? 0).toString();
    },
    retrieveManutentionStat(stats: VolunteerAssignmentStat[]): string {
      const stat = stats.find(
        (stat) => stat.category === TaskCategories.MANUTENTION
      );
      return Duration.fromMilliseconds(stat?.duration ?? 0).toString();
    },
    retrieveFunStat(stats: VolunteerAssignmentStat[]): string {
      const stat = stats.find((stat) => stat.category === TaskCategories.FUN);
      return Duration.fromMilliseconds(stat?.duration ?? 0).toString();
    },
    retrieveRelouStat(stats: VolunteerAssignmentStat[]): string {
      const stat = stats.find((stat) => stat.category === TaskCategories.RELOU);
      return Duration.fromMilliseconds(stat?.duration ?? 0).toString();
    },
    retrieveUnknownStat(stats: VolunteerAssignmentStat[]): string {
      const stat = stats.find((stat) => stat.category === null);
      return Duration.fromMilliseconds(stat?.duration ?? 0).toString();
    },
  },
});
</script>

<style lang="scss" scoped></style>
