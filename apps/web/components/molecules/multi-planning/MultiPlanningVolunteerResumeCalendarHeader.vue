<template>
  <div class="volunteer-card">
    <span class="volunteer-name">
      {{ buildUserNameWithNickname(volunteer) }}
    </span>
    <div class="teams">
      <TeamChip
        v-for="team of volunteer.teams"
        :key="team"
        :team="team"
        size="x-small"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { buildUserNameWithNickname } from "@overbookd/user";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";

defineProps({
  volunteer: {
    type: Object as PropType<VolunteerForCalendar>,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.volunteer-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 2px 2px 2px;
  gap: 2px;
}

.teams {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.volunteer-name {
  font-size: 1rem;
  font-weight: 500;
  margin-top: 2px;
  margin-bottom: 2px;
  text-align: center;
  min-width: 100%;
}
</style>
