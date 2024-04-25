<template>
  <v-data-table
    :headers="headers"
    :items="displayedVolunteers"
    :items-per-page="-1"
    :custom-sort="customSort"
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
    <template #item.total="{ item }">
      {{ retrieveTotalDuration(item.stats) }}
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from "vue";
import {
  TaskCategoryEmoji,
  TaskCategoryEmojis,
} from "~/utils/models/ft-time-span.model";
import {
  BAR,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import { AUCUNE } from "~/utils/assignment/task-category";
import { VolunteerAssignmentStat, AssignmentStats } from "@overbookd/http";
import { UserPersonalData } from "@overbookd/user";
import {
  sortVolunteerOnNames,
  sortVolunteerOnTaskCategoryAssignmentDuration,
  sortVolunteerOnTotalAssignmentDuration,
  sumAssignmentDuration,
} from "~/utils/functions/sort-stats";
import { Duration } from "@overbookd/period";

function searchStatic(stat: VolunteerAssignmentStat): boolean {
  return stat.category === STATIQUE;
}

function searchBar(stat: VolunteerAssignmentStat): boolean {
  return stat.category === BAR;
}

function searchManutention(stat: VolunteerAssignmentStat): boolean {
  return stat.category === MANUTENTION;
}

function searchFun(stat: VolunteerAssignmentStat): boolean {
  return stat.category === FUN;
}

function searchRelou(stat: VolunteerAssignmentStat): boolean {
  return stat.category === RELOU;
}

function searchUnknown(stat: VolunteerAssignmentStat): boolean {
  return stat.category === null;
}

export default Vue.extend({
  name: "VolunteerStatsTable",
  props: {
    volunteers: {
      type: Array as () => UserPersonalData[],
      required: true,
    },
  },
  data: () => ({
    headers: [
      { text: "Benevole", value: "volunteer" },
      { text: "Creneaux statiques", value: STATIQUE },
      { text: "Creneaux bar", value: BAR },
      { text: "Creneaux manutention", value: MANUTENTION },
      { text: "Creneaux fun", value: FUN },
      { text: "Creneaux relous", value: RELOU },
      { text: "Creneaux indetermines", value: AUCUNE },
      { text: "Totaux", value: "total" },
    ],
  }),
  computed: {
    displayedVolunteers(): AssignmentStats[] {
      return this.$accessor.assignment.stats.filter(({ id }) =>
        this.volunteers.some(
          ({ id: displayedVolunteerId }) => displayedVolunteerId === id,
        ),
      );
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
      return Duration.ms(stat?.duration ?? 0).toString();
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
    retrieveTotalDuration(stats: VolunteerAssignmentStat[]): string {
      return sumAssignmentDuration(stats).toString();
    },
    customSort: function (
      volunteers: AssignmentStats[],
      sortsBy: string[],
      sortsDesc: boolean[],
    ) {
      const [sortOn] = sortsBy;
      const [sortDesc] = sortsDesc;
      switch (sortOn) {
        case "volunteer":
          return sortVolunteerOnNames(volunteers, sortDesc);
        case STATIQUE:
        case MANUTENTION:
        case BAR:
        case RELOU:
        case FUN:
          return sortVolunteerOnTaskCategoryAssignmentDuration(
            volunteers,
            sortDesc,
            sortOn,
          );
        case AUCUNE:
          return sortVolunteerOnTaskCategoryAssignmentDuration(
            volunteers,
            sortDesc,
          );
        case "total":
          return sortVolunteerOnTotalAssignmentDuration(volunteers, sortDesc);
        default:
          return volunteers;
      }
    },
  },
});
</script>

<style lang="scss" scoped></style>
