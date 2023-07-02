<template>
  <div class="task-card">
    <div class="task-card-data" @contextmenu.prevent="openFtNewTab(ft.id)">
      <div class="task-name">
        <span>{{ ft.id }} - {{ ft.name }}</span>
      </div>
      <div class="task-teams">
        <TeamChip
          v-for="teamCode of sortedVolunteerTeams"
          :key="teamCode"
          :team="teamCode"
        ></TeamChip>
      </div>
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import {
  FtWithTimeSpan,
  getRequiredTeamsInFt,
} from "~/utils/models/ftTimeSpan";
import { sortTeamsForAssignment } from "~/utils/models/team";

export default Vue.extend({
  name: "TaskResume",
  components: { TeamChip },
  props: {
    ft: {
      type: Object as () => FtWithTimeSpan,
      required: true,
    },
  },
  computed: {
    sortedVolunteerTeams(): string[] {
      const teams = this.getRequiredTeams();
      return sortTeamsForAssignment(teams);
    },
  },
  methods: {
    getRequiredTeams() {
      return getRequiredTeamsInFt(this.ft);
    },
    openFtNewTab(ftId: number) {
      window.open(`/ft/${ftId}`, "_blank");
    },
  },
});
</script>

<style lang="scss" scoped>
.task-card {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.task-card-data {
  height: 64px;
  overflow: hidden;
  display: flex;
}

.task-name {
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 8px;
}

.task-teams {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 8px;
  margin: 2px 0 2px 5px;
  flex-wrap: wrap;
  flex-basis: 100px;
  gap: 2px;
}
</style>
