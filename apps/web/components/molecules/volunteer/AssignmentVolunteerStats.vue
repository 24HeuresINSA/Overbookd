<template>
  <div class="volunteer-stats">
    <button
      v-for="stat in sortedStats"
      :key="stat.category"
      v-tooltip:bottom="getStatCategoryName(stat.category)"
      @click="() => selectCategory(stat.category)"
    >
      {{ getDisplayedStat(stat) }}
    </button>
    <span>•</span>
    <button @click="resetSelected">Total : {{ displayedTotalDuration }}</button>
    <span>•</span>
    <v-tooltip location="bottom">
      <template #activator="{ props }">
        <button v-bind="props" @click="selectWithFriends">
          🫂 {{ getDisplayedDuration(stats.withFriendsAssignmentDuration) }}
        </button>
      </template>
      <span>
        Avec des ami·e·s
        <br />
        {{ stats.friendsCount }} ami·e
        {{ stats.friendsCount !== 1 ? "·s" : "" }} au total
      </span>
    </v-tooltip>
  </div>
</template>

<script lang="ts" setup>
import type { Category } from "@overbookd/festival-event-constants";
import type { AssignmentStats } from "@overbookd/http";
import { Duration } from "@overbookd/time";
import {
  AUCUNE,
  displayableCategories,
  getStatCategoryEmoji,
  getStatCategoryName,
  type DisplayableCategory,
} from "~/utils/assignment/task-category";
import { sumAssignmentDuration } from "~/utils/sort/sort-stats.utils";
import type { DisplayableAssignmentStat } from "~/utils/user/user-information";

const selectedCategory = defineModel<Category | null | undefined>(
  "selectedCategory",
  { default: undefined },
);
const selectedWithFriends = defineModel<boolean>("selectedWithFriends", {
  default: undefined,
});

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

const getDisplayedDuration = (duration: number): string => {
  return Duration.ms(duration).toString();
};
const getDisplayedStat = (stat: DisplayableAssignmentStat): string => {
  const emoji = getStatCategoryEmoji(stat.category);
  const duration = getDisplayedDuration(stat.duration);
  return `${emoji} ${duration}`;
};

const selectCategory = (category: DisplayableCategory | undefined) => {
  selectedCategory.value = category === AUCUNE ? null : category;
};
const selectWithFriends = () => {
  selectedWithFriends.value = true;
};
const resetSelected = () => {
  selectedCategory.value = undefined;
  selectedWithFriends.value = false;
};
</script>

<style scoped>
.volunteer-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
