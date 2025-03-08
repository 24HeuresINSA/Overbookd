<template>
  <DesktopPageTitle />
  <div class="need-help">
    <NeedHelpFilterCard
      :loading="loading"
      class="need-help__item"
      @fetch="fetchVolunteers"
    />
    <NeedHelpVolunteerListCard
      :volunteers="volunteers"
      :loading="loading"
      class="need-help__item mobile-only"
    />
    <OverMultiCalendar
      v-model="day"
      :volunteers="volunteersForCalendar"
      :event-to-add="eventToAdd"
      class="need-help__item desktop-only"
    />
  </div>
</template>

<script lang="ts" setup>
import type { HelpingVolunteer } from "@overbookd/http";
import {
  type CalendarEvent,
  createCalendarEvent,
} from "~/utils/calendar/event";
import type { VolunteerForCalendar } from "~/utils/calendar/volunteer";

useHead({ title: "Besoin d'aide" });

const needHelpStore = useNeedHelpStore();

const start = computed<Date>(() => needHelpStore.start);
const end = computed<Date>(() => needHelpStore.end);
const day = ref<Date>(start.value);

const volunteers = computed<HelpingVolunteer[]>(
  () => needHelpStore.filteredVolunteers,
);
const volunteersForCalendar = computed<VolunteerForCalendar[]>(() =>
  volunteers.value.map((volunteer) => ({
    ...volunteer,
    assignments: volunteer.assignments.map(createCalendarEvent),
  })),
);

const loading = ref<boolean>(true);

const fetchVolunteers = async () => {
  loading.value = true;
  await needHelpStore.fetchVolunteers();
  day.value = needHelpStore.start;
  loading.value = false;
};

needHelpStore.resetToDefaultPeriod();
fetchVolunteers();

const eventToAdd = computed<CalendarEvent>(() => {
  return createCalendarEvent({
    name: "Viens m'aider",
    start: start.value,
    end: end.value,
    color: "tertiary",
  });
});
</script>

<style lang="scss" scoped>
.need-help {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
  &__item {
    width: 100%;
  }
}
</style>
