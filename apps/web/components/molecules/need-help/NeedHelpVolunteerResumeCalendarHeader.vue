<template>
  <div class="volunteer-card">
    <span class="volunteer-name">{{ buildUserName(volunteer) }}</span>
    <div class="teams">
      <TeamChip
        v-for="team of volunteer.teams"
        :key="team"
        :team="team"
        size="x-small"
      />
    </div>
    <a :href="formatPhoneLink(volunteer?.phone ?? '')" class="volunteer-phone">
      {{ formatUserPhone(volunteer?.phone ?? "") }}
    </a>
  </div>
</template>

<script lang="ts" setup>
import { buildUserName } from "@overbookd/user";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";
import { formatPhoneLink, formatUserPhone } from "~/utils/user/user.utils";

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

.volunteer-phone {
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  color: rgb(var(--v-theme-on-surface));
}
</style>
