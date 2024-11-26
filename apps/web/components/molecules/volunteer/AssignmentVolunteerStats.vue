<template>
  <div class="volunteer-stats">
    <div v-for="stat in sortedStats" :key="stat.category" class="stat">
      <span v-tooltip:bottom="getStatCategoryName(stat.category)">
        {{ getDisplayedStat(stat) }}
      </span>
    </div>
    <span class="dot">•</span>
    <span v-tooltip:bottom="'Total'">
      Total: {{ displayedTotalDuration }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { AssignmentStat } from "@overbookd/http";
import { Duration } from "@overbookd/time";
import {
  AUCUNE,
  type DisplayableCategory,
  displayableCategories,
  taskCategoryEmojiMap,
  taskCategoryEmojis,
} from "~/utils/assignment/task-category";
import type { DisplayableAssignmentStat } from "~/utils/user/user-information";

const props = defineProps({
  stats: {
    type: Array as PropType<AssignmentStat[]>,
    required: true,
  },
});

const sortedStats = computed<DisplayableAssignmentStat[]>(() => {
  return displayableCategories
    .map((displayableCategory) => {
      const categoryStat = props.stats.find(
        ({ category }) => (category ?? AUCUNE) === displayableCategory,
      );
      return categoryStat ?? { category: displayableCategory, duration: 0 };
    })
    .sort((a, b) => {
      const aIndex = displayableCategories.indexOf(a.category ?? AUCUNE);
      const bIndex = displayableCategories.indexOf(b.category ?? AUCUNE);
      return aIndex - bIndex;
    });
});
const displayedTotalDuration = computed<string>(() => {
  return Duration.ms(
    sortedStats.value.reduce((total, { duration }) => total + duration, 0),
  ).toString();
});

const getStatCategoryEmoji = (category: DisplayableCategory | null): string => {
  if (category === null) return taskCategoryEmojis.AUCUNE;
  return taskCategoryEmojiMap.get(category) ?? taskCategoryEmojis.AUCUNE;
};
const getStatCategoryName = (category: DisplayableCategory | null): string => {
  return capitalizeFirstLetter(category?.toLowerCase() ?? "indeterminé");
};
const getDisplayedDuration = (duration: number): string => {
  return Duration.ms(duration).toString();
};
const getDisplayedStat = (stat: DisplayableAssignmentStat): string => {
  const emoji = getStatCategoryEmoji(stat.category);
  const duration = getDisplayedDuration(stat.duration);
  return `${emoji} ${duration}`;
};
</script>

<style scoped>
.volunteer-stats {
  display: flex;
  flex-wrap: wrap;
}

.stat,
.dot {
  display: flex;
  align-items: center;
  margin-right: 10px;
}
</style>
