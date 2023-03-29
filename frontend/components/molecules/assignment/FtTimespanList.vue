<template>
  <div class="timespan-list">
    <v-data-table
      :headers="headers"
      :items="timespans"
      hide-default-footer
      disable-pagination
      dense
    >
      <template #body="{ items }">
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="index"
            class="timespan-list__item"
            @contextmenu.prevent="openFtNewTab(item.ft.id)"
          >
            <td>{{ item.ft.id }} - {{ item.ft.name }}</td>
            <td>
              {{ formatDate(item.start) }}
            </td>
            <td>
              <TeamChip
                v-for="requestedTeam of item.requestedTeams"
                :key="requestedTeam.code"
                :team="requestedTeam.code"
              ></TeamChip>
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { TimespanWithFt } from "~/utils/models/ftTimespan";
import TeamChip from "~/components/atoms/TeamChip.vue";

export default Vue.extend({
  name: "FtTimespanList",
  components: { TeamChip },
  props: {
    timespans: {
      type: Array as () => TimespanWithFt[],
      required: true,
      default: () => [],
    },
  },
  data: () => ({
    headers: [
      { text: "FT", value: "ftId" },
      { text: "Date", value: "start" },
      { text: "Requis", value: "required", sortable: false },
    ],
  }),
  methods: {
    formatDate(date: Date) {
      return formatDateWithMinutes(date);
    },
    openFtNewTab(ftId: number) {
      window.open(`/ft/${ftId}`, "_blank");
    },
  },
});
</script>

<style lang="scss" scoped>
.timespan-list {
  width: 100%;
  height: 100%;
  overflow: auto;
  &__item {
    cursor: pointer;
  }
}
</style>
