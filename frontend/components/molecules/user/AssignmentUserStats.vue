<template>
  <div class="user-stats">
    <div v-for="stat in stats" :key="stat.category" class="stat">
      <v-tooltip top>
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Duration } from "~/utils/date/duration";
import {
  TaskCategory,
  TaskCategoryEmojiMap,
  TaskCategoryEmojis,
} from "~/utils/models/ftTimespan";
import { VolunteerAssignmentStat } from "~/utils/models/user";

export default Vue.extend({
  name: "AssignmentUserStats",
  props: {
    stats: {
      type: Array as () => VolunteerAssignmentStat[],
      required: true,
    },
  },
  methods: {
    getStatCategoryEmoji(category: TaskCategory | null): string {
      if (category === null) return TaskCategoryEmojis.AUCUNE;
      return TaskCategoryEmojiMap.get(category) ?? TaskCategoryEmojis.AUCUNE;
    },
    getStatCategoryName(category: TaskCategory | null): string {
      return category?.toLowerCase() ?? "indeterminé";
    },
    getDisplayedDuration(duration: number): string {
      return Duration.fromMilliseconds(duration).toString();
    },
    getDisplayedStat(stat: VolunteerAssignmentStat): string {
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
