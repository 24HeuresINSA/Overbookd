<template>
  <DesktopPageTitle />

  <div class="multi-planning">
    <MultiPlanningFilterCard @apply="onApplyFilters" />

    <OverMultiCalendar
      v-model="day"
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :volunteers="volunteersForCalendar"
    >
      <template #volunteer-header="{ volunteer }">
        <MultiPlanningVolunteerResumeCalendarHeader
          :volunteer="volunteer"
          class="volunteer-header"
        />
      </template>
    </OverMultiCalendar>
  </div>
</template>

<script lang="ts" setup>
import type { User } from "@overbookd/user";
import { createCalendarEvent } from "~/utils/calendar/event";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";

useHead({ title: "Multi Planning" });

const multiPlanningStore = useMultiPlanningStore();
const configurationStore = useConfigurationStore();

const volunteersForCalendar = computed<VolunteerForCalendar[]>(() =>
  multiPlanningStore.volunteers.map((volunteer) => ({
    ...volunteer,
    assignments: volunteer.assignments.map(createCalendarEvent),
  })),
);

const onApplyFilters = (volunteers: User[]) => {
  multiPlanningStore.fetchVolunteers(volunteers.map(({ id }) => id));
};

const day = ref<Date>(configurationStore.eventStartDate);
const page = ref<number>(0);
const itemsPerPage = ref<number>(10);
</script>

<style lang="scss" scoped>
@use "~/assets/calendar.scss" as *;

.multi-planning {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}
</style>
