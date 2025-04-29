<template>
  <div class="task-card">
    <div class="task-card__data" @contextmenu.prevent="openFtNewTab(task.id)">
      <div class="task-card__name">
        <span>{{ task.id }} - {{ task.name }}</span>
      </div>
      <div class="task-card__teams">
        <TeamChip
          v-for="code of sortedVolunteerTeams"
          :key="code"
          :team="code"
          show-hidden
        />
      </div>
    </div>
    <v-divider />
  </div>
</template>

<script lang="ts" setup>
import type { TaskForAssignment } from "@overbookd/assignment";
import { FT_URL } from "@overbookd/web-page";
import { sortTeamsForAssignment } from "~/utils/sort/sort-teams.utils";

const props = defineProps({
  task: {
    type: Object as PropType<TaskForAssignment>,
    required: true,
  },
});

const sortedVolunteerTeams = computed<string[]>(() =>
  sortTeamsForAssignment(props.task.teams),
);

const openFtNewTab = (ftId: number) => {
  window.open(`${FT_URL}/${ftId}`);
};
</script>

<style lang="scss" scoped>
.task-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  &__data {
    height: 64px;
    overflow: hidden;
    display: flex;
  }
  &__name {
    flex: 1;
    display: flex;
    align-items: center;
    padding-left: 8px;
  }
  &__teams {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 8px;
    margin: 2px 0 2px 5px;
    flex-wrap: wrap;
    flex-basis: 100px;
    gap: 2px;
  }
}
</style>
