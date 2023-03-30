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
              <TeamChip
                v-for="teamCode of getRequiredTeams(item)"
                :key="teamCode"
                :team="teamCode"
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
import {
  FtWithTimespan,
  getRequiredTeamsInFt,
} from "~/utils/models/ftTimespan";
import TeamChip from "~/components/atoms/TeamChip.vue";

export default Vue.extend({
  name: "FtList",
  components: { TeamChip },
  props: {
    fts: {
      type: Array as () => FtWithTimespan[],
      required: true,
      default: () => [],
    },
  },
  data: () => ({
    headers: [
      { text: "FT", value: "ft" },
      { text: "Equipes", value: "teams", sortable: false },
    ],
  }),
  methods: {
    getRequiredTeams(ft: FtWithTimespan) {
      return getRequiredTeamsInFt(ft);
    },
    selectFt(ft: FtWithTimespan) {
      this.$accessor.assignment.setSelectedFt(ft);
      // TODO: A retirer quand il y aura le calendrier
      this.$accessor.assignment.setSelectedTimespan(ft.timespans[0]);
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
