<template>
  <div class="task-card">
    <div class="task-card-data" @contextmenu.prevent="openFtNewTab(ft.id)">
      <div class="task-name">
        <span>{{ ft.id }} - {{ ft.name }}</span>
      </div>
      <div class="task-teams">
        <TeamIconChip
          v-for="teamCode of sortedVolunteerTeams"
          :key="teamCode"
          :team="teamCode"
          class="task-teams__team"
        />
      </div>
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TeamIconChip from "~/components/atoms/TeamIconChip.vue";
import {
  FtWithTimespan,
  getRequiredTeamsInFt,
} from "~/utils/models/ftTimespan";
import { sortTeamsForAssignment } from "~/utils/models/team";

export default Vue.extend({
  name: "TaskResume",
  components: { TeamIconChip },
  props: {
    ft: {
      type: Object as () => FtWithTimespan,
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
  margin-left: 5px;
  flex-wrap: wrap;
  flex-basis: 130px;

  &__team {
    margin: 2px;
  }
}
</style>
