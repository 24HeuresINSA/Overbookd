<template>
  <div class="timespan-list" @mouseleave="hoverTimespan(null)">
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
            @mouseover="hoverTimespan(item)"
          >
            <td>{{ item.ft.id }} - {{ item.ft.name }}</td>
            <td>
              {{ formatDate(item.start) }}
            </td>
            <td>
              <TeamIconChip
                v-for="requestedTeam of item.requestedTeams"
                :key="requestedTeam.code"
                :team="requestedTeam.code"
              ></TeamIconChip>
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
import TeamIconChip from "~/components/atoms/TeamIconChip.vue";

export default Vue.extend({
  name: "FtTimespanList",
  components: { TeamIconChip },
  props: {
    timespans: {
      type: Array as () => TimespanWithFt[],
      required: true,
      default: () => [],
    },
  },
  data: () => ({
    headers: [
      { text: "FT", value: "ft" },
      { text: "Date", value: "start" },
      { text: "Requis", value: "required", sortable: false },
    ],
  }),
  methods: {
    formatDate(date: Date) {
      return formatDateWithMinutes(date);
    },
    hoverTimespan(timespan: TimespanWithFt | null) {
      this.$accessor.assignment.setHoverTimespan(timespan);
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
