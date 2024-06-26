<template>
  <div class="user-stats">
    <div v-for="stat in sortedStats" :key="stat.category" class="stat">
      <v-tooltip bottom>
        <template #activator="{ on, attrs }">
          <p class="stat__duration" v-bind="attrs" v-on="on">
            {{ getDisplayedStat(stat) }}
          </p>
        </template>
        <span class="stat__category">
          {{ getStatCategoryName(stat.category) }}
        </span>
      </v-tooltip>
    </div>
    <span class="stat">•</span>
    <v-tooltip bottom>
      <template #activator="{ on, attrs }">
        <p class="stat__duration" v-bind="attrs" v-on="on">
          total: {{ displayedTotalDuration }}
        </p>
      </template>
      <span class="stat__category">Total</span>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { AssignmentStat } from "@overbookd/http";
import { Duration } from "@overbookd/period";
import Vue from "vue";
import {
  AUCUNE,
  DisplayableCategory,
  displayableCategories,
} from "~/utils/assignment/task-category";
import {
  TaskCategoryEmojiMap,
  TaskCategoryEmojis,
} from "~/utils/assignment/task-category";
import { DisplayableAssignmentStat } from "~/utils/user/user-information";

export default Vue.extend({
  name: "AssignmentUserStats",
  props: {
    stats: {
      type: Array as () => AssignmentStat[],
      required: true,
    },
  },
  computed: {
    sortedStats(): DisplayableAssignmentStat[] {
      return displayableCategories
        .map((displayableCategory) => {
          const categoryStat = this.stats.find(
            ({ category }) => (category ?? AUCUNE) === displayableCategory,
          );
          return categoryStat ?? { category: displayableCategory, duration: 0 };
        })
        .sort((a, b) => {
          const aIndex = displayableCategories.indexOf(a.category ?? AUCUNE);
          const bIndex = displayableCategories.indexOf(b.category ?? AUCUNE);
          return aIndex - bIndex;
        });
    },
    displayedTotalDuration(): string {
      return Duration.ms(
        this.sortedStats.reduce((total, { duration }) => total + duration, 0),
      ).toString();
    },
  },
  methods: {
    getStatCategoryEmoji(category: DisplayableCategory | null): string {
      if (category === null) return TaskCategoryEmojis.AUCUNE;
      return TaskCategoryEmojiMap.get(category) ?? TaskCategoryEmojis.AUCUNE;
    },
    getStatCategoryName(category: DisplayableCategory | null): string {
      return category?.toLowerCase() ?? "indeterminé";
    },
    getDisplayedDuration(duration: number): string {
      return Duration.ms(duration).toString();
    },
    getDisplayedStat(stat: DisplayableAssignmentStat): string {
      const emoji = this.getStatCategoryEmoji(stat.category);
      const duration = this.getDisplayedDuration(stat.duration);
      return `${emoji} ${duration}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.user-stats {
  display: flex;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  margin-right: 10px;

  &__category {
    text-transform: capitalize;
  }
  &__duration {
    font-size: 1.1rem;
    margin: 0;
  }
}
</style>
