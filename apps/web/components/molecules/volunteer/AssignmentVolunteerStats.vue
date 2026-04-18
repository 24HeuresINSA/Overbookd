<template>
  <div class="volunteer-stats">
    <span
      v-for="stat in sortedStats"
      :key="stat.category"
      v-tooltip:bottom="getStatCategoryName(stat.category)"
    >
      {{ getDisplayedStat(stat) }}
    </span>
    <span>•</span>
    <span> Total : {{ displayedTotalDuration }} </span>
    <span>•</span>
    <span>
      Avec des amis : {{ Duration.ms(stats.withFriendsAssignmentDuration) }} ({{
        stats.friendsCount
      }}
      ami{{ stats.friendsCount !== 1 ? "s" : "" }})
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { AssignmentStats } from "@overbookd/http";
import { Duration } from "@overbookd/time";
import {
  AUCUNE,
  type DisplayableCategory,
  displayableCategories,
  taskCategoryEmojiMap,
  taskCategoryEmojis,
} from "~/utils/assignment/task-category";
import { sumAssignmentDuration } from "~/utils/sort/sort-stats.utils";
import type { DisplayableAssignmentStat } from "~/utils/user/user-information";

const { stats } = defineProps({
  stats: {
    type: Object as PropType<AssignmentStats>,
    required: true,
  },
});

const sortedStats = computed<DisplayableAssignmentStat[]>(() => {
  return displayableCategories
    .map((displayableCategory) => {
      const categoryStat = stats.stats.find(
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
  return sumAssignmentDuration(sortedStats.value).toString();
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
  gap: 10px;
}
</style>
