<template>
  <DesktopPageTitle />
  <div class="need-help">
    <TimelineFormCards
      v-model:loading="loading"
      class="need-help__item"
      @apply="onApplyFilters"
    />
    <NeedHelpVolunteerListCard
      :volunteers="volunteers"
      :loading="loading"
      class="need-help__item mobile-only"
    />
    <OverMultiCalendar
      v-show="!loading && volunteers.length > 0"
      v-model="day"
      :volunteers="volunteersForCalendar"
      :event-to-add="eventToAdd"
      class="need-help__item desktop-only"
    >
      <template #volunteer-header>
        <NeedHelpVolunteerResumeCalendarHeader
          v-for="volunteer in volunteersForCalendar"
          :key="volunteer.id"
          :volunteer="volunteer"
          class="volunteer-header"
        />
      </template>
    </OverMultiCalendar>
    <p
      v-if="!loading && volunteers.length === 0"
      class="no-volunteers desktop-only"
    >
      Aucun bénévole disponible sur ce créneau
    </p>
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

const loading = ref<boolean>(false);

const onApplyFilters = () => {
  day.value = needHelpStore.start;
};

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
@use "~/assets/calendar.scss" as *;

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

.no-volunteers {
  text-align: center;
  font-size: 1.5rem;
  margin-top: 2rem;
}
</style>
