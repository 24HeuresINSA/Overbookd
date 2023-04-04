<template>
  <div class="task-list">
    <v-data-table
      :headers="headers"
      :items="fts"
      hide-default-footer
      disable-pagination
      dense
    >
      <template #body="{ items }">
        <tbody>
          <tr
            v-for="(item, index) in items"
            :key="index"
            class="task-list__item"
            @contextmenu.prevent="openFtNewTab(item.id)"
            @click="selectFt(item)"
          >
            <td>{{ item.id }} - {{ item.name }}</td>
            <td>
              <TeamIconChip
                v-for="teamCode of getRequiredTeams(item)"
                :key="teamCode"
                :team="teamCode"
              />
            </td>
          </tr>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamIconChip from "~/components/atoms/TeamIconChip.vue";
import { FtWithTeamRequests } from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "FtList",
  components: { TeamIconChip },
  props: {
    fts: {
      type: Array as () => FtWithTeamRequests[],
      required: true,
      default: () => [],
    },
  },
  data: () => ({
    headers: [
      { text: "FT", value: "ft", sortable: false },
      { text: "Equipes", value: "teams", sortable: false },
    ],
  }),
  methods: {
    getRequiredTeams(ft: FtWithTeamRequests) {
      return [...new Set(ft.teamRequests.map(({ code }) => code))];
    },
    selectFt(ft: FtWithTeamRequests) {
      this.$accessor.assignment.setSelectedFt(ft);
      this.$accessor.assignment.setVolunteers([]);
      this.$accessor.assignment.fetchTimespansWithStats(ft.id);
    },
    openFtNewTab(ftId: number) {
      window.open(`/ft/${ftId}`, "_blank");
    },
  },
});
</script>

<style lang="scss" scoped>
.task-list {
  width: 100%;
  height: 100%;
  overflow: auto;
  &__item {
    cursor: pointer;
  }
}
</style>
